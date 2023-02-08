import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
// import { LoignResponse, SeviceSecretResponse, UserResponse } from "../types/response/UserTypes";
// import { ResponseModel } from "../types/response/CommonTypes";

// import { UserApi } from "../modules/api/v1/UserApi";
import L10n from "../modules/L10n";

import { Modal } from "antd";
import { AuthApi } from "../modules/api/v1/AuthApi";
// import { MenuApi } from "../modules/api/v1/MenuApi";
// import { ServiceApi } from "../modules/api/v1/ServiceApi";
// import { RoleType } from "../enum/RoleType";
// import { ServiceAcctResponse } from "../types/response/ServiceAcct";
// import { ServiceAcct } from "../modules/api/v1/ServiceAcct";
// import { LS_TRIAL_VIEW_DISP } from "../modules/StringUtils";
// import { AccountApi } from "../modules/api/v1/Account";
// import { LangApi } from "../modules/api/v1/LangApi";

type ContextProps = {
  authenticated: boolean;
  // user: UserResponse;
  login: (
    username: string,
    password: string,
    setLoginLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => Promise<void>;
  logout: () => void;
  menu: Map<string, boolean>;
  // service: SeviceSecretResponse;
  // serviceAcct: ServiceAcctResponse;
};

const AuthContext = createContext<Partial<ContextProps>>({});

type AuthProviderProps = {
  //children: JSX.Element,
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserResponse | undefined>();
  const [menu, setMenu] = useState<Map<string, boolean>>();
  const [service, setService] = useState<SeviceSecretResponse | undefined>();
  const [serviceAcct, setServiceAcct] = useState<ServiceAcctResponse | undefined>()
  const [langCode, setLangCode] = useState<string>("")

  useEffect(() => {
    if (location.pathname === "/enter") return;

    async function loadUserFromCookies() {
      const accessToken = Cookies.get("access_token");
      if (accessToken) {
        const responseUser = await UserApi.getMe();
        const responseMenu = await MenuApi.getMenu();
        const responseSvc = await ServiceApi.getService();
        const responseSvcAcct = await ServiceAcct.getServiceAcct();

        const user = responseUser.data.result;

        if (user !== undefined) {
          setUser(user);
        }

        const menu = responseMenu.data.result;

        if (menu) {
          const data = JSON.stringify(menu);
          const map = new Map<string, boolean>(
            Object.entries(JSON.parse(data))
          );
          setMenu(map);
        }

        const service = responseSvc.data.result

        if(service != undefined){
          setService(service)
        }

        const serviceAcct = responseSvcAcct.data.result
        if(serviceAcct != undefined){
          setServiceAcct(serviceAcct)
        }

        const useLang = Cookies.get("lang") == undefined ? navigator.language : Cookies.get("lang")?.toString()!!
        L10n.setLang(useLang)
        LangApi.getLang(useLang).then((response) => {
          const langResourceUrl = response.data.result
          L10n.setLocalization(useLang, langResourceUrl!!)
          L10n.setLang(useLang)
        })
      }
    }
    loadUserFromCookies();
  }, []);

  const login = async (
    username: string,
    password: string,
    setLoginLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setLoginLoading(true);

    AuthApi.login(username, password)
      .then((response) => {

        if(response.data.status != 200){
          loginFail(username);
          return;
        }

        const responseLoginModel: ResponseModel<LoignResponse> = response.data;
        Cookies.set("access_token", responseLoginModel.result?.accessToken!);

        ServiceApi.getService().then((response) => {
          const responseModel: ResponseModel<SeviceSecretResponse> = response.data;
          setService(responseModel.result);
        })

        ServiceAcct.getServiceAcct().then((response) => {
          const responseModel: ResponseModel<ServiceAcctResponse> = response.data;
          setServiceAcct(responseModel.result)
        })

        MenuApi.getMenu().then((response) => {
          const responseModel = response.data;
          const data = JSON.stringify(responseModel.result);
          const map = new Map<string, boolean>(
            Object.entries(JSON.parse(data))
          );
          setMenu(map);
        });

        UserApi.getMe().then((response) => {
          const responseModel: ResponseModel<UserResponse> = response.data;
          // admin, admin2 구별해서 접근 가/불 처리
          const currentLocation = window.location;
          const user = responseModel.result
          switch(user?.roleType) {
            case RoleType.ADMIN:
            case RoleType.ROOT:
              if(!currentLocation.href.startsWith(process.env.NEXT_PUBLIC_ADMIN_HOST!)) {
                Modal.error({ title: L10n.get("msg_login_failed") });
                return
              }
              break;
            case RoleType.BROADCASTER:
              if(!currentLocation.href.startsWith(process.env.NEXT_PUBLIC_ADMIN2_HOST!)) {
                Modal.error({ title: L10n.get("msg_login_failed") });
                return
              }
              break;
          }
          
          process.env.NEXT_PUBLIC_ADMIN_HOST
          setUser(responseModel.result);

          if(responseModel.result?.roleType!! > RoleType.ADMIN){
            const url = process.env.NEXT_PUBLIC_ADMIN2_HOST + "/enter?accessToken=" + responseLoginModel.result?.accessToken
            window.location.href = url
          }else{
            window.location.pathname = "/main";
          }
        });

        AccountApi.loginFailInit({username: username})

        localStorage.setItem(LS_TRIAL_VIEW_DISP, " ")

      })
      .catch((error) => {
        Modal.error({ title: L10n.get("msg_login_failed") });
      })
      .finally(() => {
        setLoginLoading(false);
      });
  };

  const loginFail = (username: string) => {
    AccountApi.loginFailCountIncrease({
      username: username
    }).then((response) => {
      const responseModel = response.data;

      if(responseModel.result?.loginFailCount!! >= 5){
          Modal.confirm({
            title: L10n.get("msg_login_fail_count_excess"),
            okText: L10n.get('msg_password_find'),
            okType: "default",
            cancelText: L10n.get('msg_username_find'),
            keyboard: false,
            onOk: () => {
              location.href = "/account/send-mail?type=3"
            },
            onCancel: () => {
              location.href = "/account/send-mail?type=2"
            }
           });
      }else{
        Modal.error({ title: L10n.get("msg_login_failed") });
      }
    })
  }

  const logout = () => {
    Cookies.remove("access_token");
    setUser(undefined);
    setMenu(undefined);
    AuthApi.deleteAuthHeader();

    window.location.pathname = "/login";
  };

  return (
    <AuthContext.Provider
      value={{ authenticated: !!user, user, login, logout, menu, service, serviceAcct }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
import { FormInstance } from "antd";
import { isNotEmpty } from "./StringUtils";

export const isCreateCloseModalInputCheck = (form: FormInstance<any>) => {
    const values = JSON.stringify(form.getFieldsValue())
    let isInputCheck = false;

    const valMap = new Map<string, any>(
      Object.entries(JSON.parse(values))
    );

    valMap.forEach((value, key) =>{
        if(typeof(value) == "number"){
          if(value != 0){
            isInputCheck = true
            return;
          }
        }else{
          if(isNotEmpty(value.toString())){
            isInputCheck = true
            return;
          }
        }
    })
    
    return isInputCheck
}
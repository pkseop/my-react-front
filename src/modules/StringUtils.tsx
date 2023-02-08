import Cookies from "js-cookie";
import L10n from "./L10n";

export const isNotEmpty = (data?: string): boolean => data !== undefined && data != null && data.trim().length > 0;

export const getLangCode = (): String => Cookies.get("lang") == null ? L10n.getLangCode(navigator.language) : Cookies.get("lang")!!;

export const LS_TABLE_PAGE_SIZE = 'table_page_size' // local storage key

export const LS_TRIAL_VIEW_DISP = 'trial_view_disp'

export const LIVE_CONTENT_NONE_USER_MOVE_LINK = '/shortform/content'

export const SHORTFORM_NONE_USER_MONVE_LINK = '/live/live-managment'
import { createAction, props } from "@ngrx/store";
import { actionNames } from "src/Helpers/constants";

export const SET_LANGUAGE = createAction(
    actionNames.LangAction.SET_LANGUAGE,
    props<{ isArabic: boolean; }>()
);
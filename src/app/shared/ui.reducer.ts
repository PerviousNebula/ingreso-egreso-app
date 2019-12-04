import * as fromUI from './ui.actions';

export interface State {
    isLoading: boolean;
}

const INIT_STATE: State = {
    isLoading: false
};

export function uiReducer(state = INIT_STATE, action: fromUI.acciones): State {
    switch (action.type) {
        case fromUI.ACTIVAR_LOADING:
            return {
                isLoading: true
            };
        case fromUI.DESACTIVAR_LOADING:
            return {
                isLoading: false
            };
        default:
            return state;
    }
}

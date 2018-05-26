import { injectMuiThemeProvider, injectReduxProvider } from '../lib';

export default (InnerComponent, customTheme = {}, initialState = null) => {
  return injectReduxProvider(
    InnerComponent,
    initialState,
  );
}

import { injectReduxProvider } from '../lib';

export default (InnerComponent, initialState = null) => {
  return injectReduxProvider(
    InnerComponent,
    initialState,
  );
}

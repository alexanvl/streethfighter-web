import { connect } from 'react-redux';
import { bindActions, rootReducer } from '../../store';

export default (InnerComponent, stateToProps = null) => {
  return connect(stateToProps || rootReducer, bindActions)(InnerComponent);
}

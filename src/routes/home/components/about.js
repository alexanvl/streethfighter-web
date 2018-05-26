import React from 'react';
import { withStyles } from 'material-ui';
import styles from './styles';

export default withStyles(styles)(props => {
  return (
    <div className={props.classes.root}>
      <figcaption>{props.heading}</figcaption>
      <img className={props.classes.img} src={props.image} alt={props.heading} />
    </div>
  );
});

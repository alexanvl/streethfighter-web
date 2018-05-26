export default theme => ({
  root: {
    flexGrow: 1,
    marginTop: 75
  },
  logoImg: {
    borderStyle: 'solid none solid none',
    borderColor: 'white',
  },
  logoRoot: {
    background: `rgba(0, 0, 0, 0)`,
    textAlign: 'right'
  },
  logoTitle: {
    fontSize: 32,
    lineHeight: 64
  },
  aboutContainer: {
    flexGrow: 1,
    marginTop: 50,
  },
  aboutItem: {
    textAlign: 'center',
    boxShadow: 'none',
    backgroundColor: theme.palette.background.default,
  }
});
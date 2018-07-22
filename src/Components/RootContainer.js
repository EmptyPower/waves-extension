import React from 'react';
import PropTypes from 'prop-types';
import { Drawer, withStyles, AppBar } from 'material-ui';
import { BrowserRouter as Router, Link } from 'react-router-dom'
import MainController from "./MainController";

const drawerWidth = 250;

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    appFrame: {
        zIndex: 1,
        // overflow: 'scroll',
        // position: 'relative',
        display: 'flex',
        width: '100%',
    },
    appBar: {
        position: 'absolute',
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    'appBarShift-left': {
        marginLeft: drawerWidth,
    },
    'appBarShift-right': {
        marginRight: drawerWidth,
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 20,
    },
    hide: {
        display: 'none',
    },
    drawerPaper: {
        position: 'relative',
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    'content-left': {
        height: '500px'
    },
    'content-right': {
        marginRight: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    'contentShift-left': {
        marginLeft: 0,
    },
    'contentShift-right': {
        marginRight: 0,
    },
    flex: {
        flex: 1,
    },
    
});

class RootContainer extends React.Component {
    state = {
        open: false,
        anchor: 'left',
    };
    
    
    constructor(props) {
        super(props);
        this.showSnackbar = this.showSnackbar.bind(this);
    }
    
    showSnackbar(text) {
        this.setState({ snackbarText: text });
    }
    
    
    render() {
        const { classes, theme } = this.props;
        const { anchor, open } = this.state;
        
        return (
          <Router>
              <div className={classes.root}>
                  <div className={classes.appFrame}>
                      
                          <MainController theme={theme}/>
                          {/*<Route path="/importAccount" component={WebAuthAPISuccess}/>*/}
                          
                          
                          {/*<Route exact path='/sign' render={(props) => (*/}
                          {/*<PaymentAPI {...props}/>*/}
                          {/*)}/>*/}
                      
                  </div>
              </div>
          </Router>
        );
    }
}

RootContainer.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(RootContainer);

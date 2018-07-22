/*global chrome*/
import React from 'react';
import PropTypes from "prop-types";

import {
    Button,
    withStyles,
    Card,
    Typography,
    CardContent,
    Grid,
    TextField,
    FormControlLabel,
    Dialog,
    DialogTitle,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    Input,
    MenuItem,
    AppBar,
    Toolbar, List, ListItem, ListItemText, Menu
} from "material-ui";
import Switch from "material-ui/Switch/Switch";
import DialogContent from "material-ui/Dialog/DialogContent";
import DialogContentText from "material-ui/Dialog/DialogContentText";
import classNames from "classnames";

const WavesAPI = require('@waves/waves-api');
const Waves = new WavesAPI.create(WavesAPI.TESTNET_CONFIG);

const styles = theme => ({
    card: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        marginBottom: 16,
        fontSize: 14,
    },
    
    content: {
        marginTop: '80px',
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    pos: {
        marginBottom: 12,
    },
    textField: {
        width: '100%'
    },
    paper: {
        padding: 10,
        height: '100%',
    },
    code: {
        wordBreak: 'break-all'
    },
    tabRoot: {
        textTransform: 'initial',
        fontWeight: theme.typography.fontWeightRegular,
        marginRight: theme.spacing.unit * 4,
        '&:hover': {
            color: '#40a9ff',
            opacity: 1,
        },
        '&$tabSelected': {
            color: '#1890ff',
            fontWeight: theme.typography.fontWeightMedium,
        },
        '&:focus': {
            color: '#40a9ff',
        },
    },
    hidden: {
        display: 'none'
    }
});


class MainController extends React.Component {
    state = {
        accounts: [],
        selectedIndex: 0,
        importNewAccount: false,
        seed: '',
        selectedAccountBalance: '...',
        page: 'importSeed',
        anchorEl: null
    };
    
    constructor(props) {
        super(props);
    }
    
    getAccounts = (callback) => {
        chrome.storage.sync.get(['accounts'], (data) => {
            callback(data.accounts);
        });
    };
    
    generateNew = () => {
        this.setState({
            seed: Waves.Seed.create().phrase
        })
    };
    
    importSeed = () => {
        const _this = this;
        this.getAccounts((accounts) => {
            if (Array.isArray(accounts)) {
                accounts.push(Waves.Seed.fromExistingPhrase(_this.state.seed));
            } else {
                accounts = [Waves.Seed.fromExistingPhrase(_this.state.seed)];
            }
            chrome.storage.sync.set({ accounts: accounts }, function () {
                _this.setState({
                    page: 'main',
                    accounts: accounts
                });
            });
        });
    };
    
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };
    
    componentDidMount() {
        this.getAccounts((accounts) => {
            if (Array.isArray(accounts)) {
                if (accounts.length > 0){
                    this.setState({
                        accounts: accounts,
                        page: 'main'
                    });
                    this.getSelectedAccountBalance();
                }
            }
        })
    }
    
    handleClickListItem = event => {
        this.setState({
            anchorEl: event.currentTarget
        });
    };
    
    getSelectedAccountBalance = () => {
        Waves.API.Node.addresses.balance(this.state.accounts[this.state.selectedIndex].address, 5)
          .then(data => {
              this.setState({ selectedAccountBalance: data.balance });
          });
        
    };
    
    handleMenuItemClick = (event, index) => {
        this.setState({
            selectedIndex: index, anchorEl: null
        });
        this.getSelectedAccountBalance();
    };
    
    handleClose = () => {
        this.setState({ anchorEl: null });
    };
    
    
    render() {
        const { classes } = this.props;
        const { anchorEl } = this.state;
        
        return (
          <div>
              <AppBar
                style={{ backgroundColor: this.props.theme.palette.primary }}
                className={classNames(classes.appBar)}
              >
                  {this.state.accounts.length > 0 && (<Toolbar>
                      <List component="nav">
                          <ListItem
                            button
                            aria-haspopup="true"
                            aria-controls="lock-menu"
                            aria-label="When device is locked"
                            onClick={this.handleClickListItem}
                          >
                              <ListItemText
                                primary={this.state.accounts[this.state.selectedIndex].address}
                                secondary={'WAVES: ' + this.state.selectedAccountBalance}
                              />
                          </ListItem>
                      </List>
                      <Menu
                        id="lock-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={this.handleClose}
                      >
                          {this.state.accounts.map((option, index) => (
                            <MenuItem
                              key={option.address}
                              selected={index === this.state.selectedIndex}
                              onClick={event => this.handleMenuItemClick(event, index)}
                            >
                                {option.address}
                            </MenuItem>
                          ))}
                          <MenuItem
                            key='Add new...'
                            selected={this.state.page === 'importSeed'}
                            onClick={event => this.setState({ page: 'importSeed', anchorEl: false })}
                          >
                              Add new...
                          </MenuItem>
                      </Menu>
                  </Toolbar>)}
              </AppBar>
              <main className={classNames(classes.content)}
              >
                  <Grid>
                      {
                          (this.state.accounts.length === 0 || this.state.page === 'importSeed') && (
                            <Grid><TextField
                              id="import-seed"
                              label="Seed"
                              multiline={true}
                              onChange={this.handleChange('seed')}
                              InputLabelProps={{
                                  shrink: true,
                              }}
                              value={this.state.seed}
                              placeholder="Paste your seed here"
                              helperText="Import seed or generate new. Your seed is stored only in browser and totally in safe"
                              fullWidth
                              margin="normal"
                            />
                                <Button size="large" onClick={this.generateNew} variant="flat" color="primary"
                                        className={classes.button}>
                                    New
                                </Button>
                                <Button size="large" onClick={this.importSeed} variant="raised" color="primary"
                                        className={classes.button}>
                                    Continue
                                </Button>
                            </Grid>
                          )
                      }
                      {
                          (this.state.accounts.length !== 0 && this.state.page === 'main') && (
                            <Grid>
                            
                            </Grid>
                          )
                      }
                  </Grid>
              </main>
          </div>
        );
    }
}

MainController.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(MainController);

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Account from "./Account";
import Loader from "../../common/loader/Loader";
import Addresses from "./Addresses";

export default class Parameters extends Component{
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            e: null,
            message: null,
            type: null,
            isLoaded: false,
            accountLoaded: false
        };
        this.reloadUser = this.reloadUser.bind(this);
        this.getUser = this.getUser.bind(this);
    }

    componentDidMount(){
        this.getUser();
    }

    getUser(){
        axios.get('/api/user')
            .then(res => {
                this.setState({
                    user: res.data,
                    isLoaded: true,
                    accountLoaded: true
                })
            })
            .catch(e => {
                this.setState({
                    e: e,
                    isLoaded: true,
                    accountLoaded: true
                })
            })
    }

    reloadUser(){
        this.setState({
            accountLoaded: false
        });
        this.getUser();
    }


    render() {
        const {user, message, type, e, isLoaded, accountLoaded} = this.state;
        if (!isLoaded){
            return (
                <div className="container-fluid">
                    <div className="row align-items-stretch">
                        <div className="col">
                            <Loader/>
                        </div>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className="container-fluid">
                    <div className="row align-items-stretch">
                        <div className="col-md-6 col-sm-12">
                            <div className="p-sm-2 p-5 h-100">
                                <div className="bg-pink-inherit text-grey rounded shadow-lg h-100">
                                    <Account user={user} reloadUser={this.reloadUser} isLoaded={accountLoaded}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-sm-12">
                            <div className="p-sm-2 p-5 h-100">
                                <div className="bg-grey-inherit text-pink rounded shadow-lg h-100">
                                    <Addresses user={user} reloadUser={this.reloadUser} isLoaded={accountLoaded}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

ReactDOM.render(<Parameters/>, document.getElementById('parameters'));
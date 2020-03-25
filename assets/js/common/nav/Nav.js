import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import logo from '../../../img/logo.png';


export default class Nav extends Component{
    constructor(props) {
        super(props);

    }
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-pink-inherit nav-border-grey shadow">
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarToggler" aria-controls="navbarToggler" aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"> </span>
                </button>
                <div className="collapse navbar-collapse" id="navbarToggler">
                    <ul className="navbar-nav mr-auto mt-2 mt-lg-0 ">
                        <li className="nav-item ">
                            <a className="nav-link h4 text-grey" href="/">Accueil</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link h4 text-grey" href="/pricing">Prestations</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link h4 text-grey" href="#contact">Contact</a>
                        </li>
                    </ul>
                </div>
                <a className="navbar-brand" href="/">
                    <img src={logo} width="110"
                         className="d-inline-block align-top" alt="logo" />
                </a>
            </nav>
        )
    }
}

ReactDOM.render(<Nav />, document.getElementById('nav'));
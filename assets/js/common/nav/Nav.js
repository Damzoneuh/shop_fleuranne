import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import logo from '../../../img/logo.png';
const el = document.getElementById('nav');

export default class Nav extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isScroll: false
        };

        this.handleScroll = this.handleScroll.bind(this);

        window.addEventListener('scroll', this.handleScroll)
    }

    handleScroll(){
        if (window.scrollY !== 0){
            this.setState({
                isScroll: true
            })
        }
        else {
            this.setState({
                isScroll: false
            })
        }
    }
    render() {
        const {isScroll} = this.state;
        return (
            <nav className={!isScroll ? "navbar navbar-expand-lg navbar-light bg-pink-inherit nav-border-grey shadow" : "navbar navbar-expand-lg navbar-light bg-pink-inherit nav-border-grey shadow position-fixed w-100"}>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarToggler" aria-controls="navbarToggler" aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"> </span>
                </button>
                <div className="collapse navbar-collapse" id="navbarToggler">
                    <ul className="navbar-nav mr-auto mt-2 mt-lg-0 ">
                        <li className="nav-item">
                            <a className="nav-link h4 text-grey" href="/">Accueil</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link h4 text-grey" href="#contact">Contact</a>
                        </li>
                    </ul>

                    <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                        <li className="nav-item">
                            <a className="nav-link h4 text-grey" href={el.dataset.user === "1" ? '/logout' : '/login'}>
                                {el.dataset.user === "1" ? <div><i className="fas fa-lock text-grey"></i><span className="small text-grey ml-2">Déconnexion</span></div>
                                    :
                                    <div><i className="fas fa-lock-open text-grey"></i><span className="small text-grey ml-2">Connexion</span></div>
                                }
                            </a>
                        </li>
                        <li className="nav-item">
                            {el.dataset.user === "1" ? <a href="/parameters" title="paramètres" className="nav-link h4"><i className="fas fa-cogs text-grey"></i></a> : ''}
                        </li>
                    </ul>
                </div>
                {!isScroll ?  <a className="navbar-brand ml-3" href="/">
                    <img src={logo} width="110"
                         className="d-inline-block align-top" alt="logo" />
                </a> : ''}

            </nav>
        )
    }
}

ReactDOM.render(<Nav />, document.getElementById('nav'));
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import logo from '../../../img/logo.png';
const el = document.getElementById('nav');
import axios from 'axios';

export default class Nav extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isScroll: false,
            links: null
        };
        this.handleScroll = this.handleScroll.bind(this);
        window.addEventListener('scroll', this.handleScroll)
    }

    componentDidMount(){
       axios.get('/api/category')
           .then(res => {
               this.setState({
                   links: res.data
               })
           })
    }


    componentWillUnmount(){
        window.removeEventListener('scroll', this.handleScroll)
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
        const {isScroll, links} = this.state;
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
                            <a className="nav-link text-grey" href="/">Accueil</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-grey" href="https://fleuranne.fr">L'institut</a>
                        </li>
                        {links && links.length > 0 ?
                               links.map(link => {
                                  return (
                                      <li className="nav-item dropdown">
                                          <a className="nav-link dropdown-toggle text-grey" href="#" id={'navbarDropdown-' + link.id}
                                             role="button" data-toggle="dropdown" aria-haspopup="true"
                                             aria-expanded="false">
                                              {link.name}
                                          </a>
                                          <div className="dropdown-menu bg-pink text-grey" aria-labelledby={'navbarDropdown-' + link.id}>
                                              {link.child && link.child.length > 0 ?
                                                  link.child.map(sub => {
                                                      return (
                                                          <a className="dropdown-item text-grey" href={'/product/category/' + sub.id}>{sub.name}</a>
                                                      )
                                                  })
                                                  : ''}
                                          </div>
                                      </li>
                                  )
                               })
                            : ''}
                        <li className="nav-item">
                            <a className="nav-link text-grey" href="#contact">Contact</a>
                        </li>
                    </ul>

                    <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                        <li className="nav-item">
                            <a className="nav-link text-grey" href={el.dataset.user === "1" ? '/logout' : '/login'}>
                                {el.dataset.user === "1" ? <div><i className="fas fa-lock text-grey"></i><span className="small text-grey ml-2">Déconnexion</span></div>
                                    :
                                    <div><i className="fas fa-lock-open text-grey"></i><span className="small text-grey ml-2">Connexion</span></div>
                                }
                            </a>
                        </li>
                        <li className="nav-item">
                            {el.dataset.user === "1" ? <a href="/parameters" title="paramètres" className="nav-link"><i className="fas fa-cogs text-grey"></i></a> : ''}
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
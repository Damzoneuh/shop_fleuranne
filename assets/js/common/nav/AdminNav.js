import React, {Component} from 'react';

export default class AdminNav extends Component{
    constructor(props) {
        super(props);

        this.changeTab = this.changeTab.bind(this);
    }

    changeTab(tabId, subTabId){
        this.props.handleTab(tabId);
        this.props.handleSubTab(subTabId)
    }

    render() {
        const {tab, subTab} = this.props;
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-grey-inherit text-pink">
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#AdminNavbar" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="AdminNavbar">
                    <div className="row">
                        <div className="col">
                            <h1 className="text-pink h4 mt-2 mb-2 border-bottom">Gestion des produits</h1>
                            <ul className="navbar-nav mr-auto flex-column">
                                <li className="nav-item">
                                    <a className={tab === 1 && subTab === 1 ? 'nav-link text-pink active-pink link' : 'nav-link text-pink link'}  onClick={() => this.changeTab(1,1)}>Créer un produit</a>
                                </li>
                                <li className="nav-item">
                                    <a className={tab === 1 && subTab === 2 ? 'nav-link text-pink active-pink link' : 'nav-link text-pink link'}  onClick={() => this.changeTab(1,2)}>Créer une marque</a>
                                </li>
                                <li className="nav-item">
                                    <a className={tab === 1 && subTab === 3 ? 'nav-link text-pink active-pink link' : 'nav-link text-pink link'}  onClick={() => this.changeTab(1,3)}>Créer une promotion</a>
                                </li>
                                <li className="nav-item">
                                    <a className={tab === 1 && subTab === 4 ? 'nav-link text-pink active-pink link' : 'nav-link text-pink link'} onClick={() => this.changeTab(1,4)}>Créer une categorie</a>
                                </li>
                                <li className="nav-item">
                                    <a className={tab === 1 && subTab === 5 ? 'nav-link text-pink active-pink link' : 'nav-link text-pink link'} onClick={() => this.changeTab(1,5)}>Créer une sous categorie</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }


}
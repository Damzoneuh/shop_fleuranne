import React, {Component} from 'react';
import axios from 'axios';
import Loader from "../loader/Loader";


export default class BasketModal extends Component{
    constructor(props) {
        super(props);
        this.state = {
            fullItems: [],
            isLoaded: false
        };
        this.getItems = this.getItems.bind(this);
        this.getItemPayload = this.getItemPayload.bind(this);
    }

    componentDidMount(){
        this.getItemPayload();
    }

    componentWillUpdate(prevProps){
        if (prevProps.items !== this.props.items){
            this.getItemPayload();
        }
    }

    getItems(){
        if (this.props.items && this.props.items.length > 0){
            this.setState({
                isLoaded: false
            });
            let items = [];
            this.props.items.map(item => {
                if (item){
                    axios.get('/api/item/' + item.id)
                        .then(res => {
                            items.push(res.data);
                            this.setState({
                                fullItems: items
                            })
                        })
                }
            })
        }
    }

    getItemPayload(){
        const getItemPayload = new Promise(resolve => {
            resolve(this.getItems());
        });

        getItemPayload.then(res => {
            this.setState({
                isLoaded: true
            })
        })
    }

    render() {
        const {isLoaded, fullItems} = this.state;
        const {items} = this.props;
        return (
            <div className="modal fade" id="basketModal" tabIndex="-1" role="dialog"
                 aria-labelledby="basketModal" aria-hidden="true">
                <div className="modal-dialog modal-xl modal-dialog-scrollable" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="basketModalTitle">Mon panier</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {!isLoaded ? <Loader/> : ''}
                            <table className="table table-responsive-md table-striped ">
                                <thead>
                                    <tr className="h5 text-grey">
                                        <th scope="col">
                                            Produit
                                        </th>
                                        <th scope="col">
                                            Intitulé
                                        </th>
                                        <th scope="col">
                                            Quantité
                                        </th>
                                        <th scope="col">
                                            Prix total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                            {fullItems && isLoaded && fullItems.length > 0 ?
                                    fullItems.map(item => {
                                        return(
                                            <tr className="text-grey">
                                                <td>
                                                    <img src={'https://' + window.location.hostname + '/img/' + item.img[0].id} style={{width: '50px'}} className="img-thumbnail m-1"/>
                                                </td>
                                                <td >
                                                    {item.name}
                                                </td>
                                                <td >
                                                    {items[item.id].quantity}
                                                </td>
                                                <td >
                                                    {item.price * items[item.id].quantity}
                                                </td>
                                            </tr>
                                        )
                                    })
                                : 'Votre panier est vide'}
                                </tbody>
                            </table>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Fermer</button>
                            <button type="button" className="btn btn-primary">Valider mon panier</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


}
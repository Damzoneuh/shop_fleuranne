import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Loader from "../../common/loader/Loader";

const el = document.getElementById('item');
export default class Show extends Component{
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            id: el.dataset.item,
            product: null,
            isLoaded: false
        }
    }

    componentDidMount(){
        axios.get('/api/item/' + this.state.id)
            .then(res => {
                this.setState({
                    product: res.data,
                    isLoaded: true
                })
            })
    }

    handleClick(){
      handleAddBasketItem(document.getElementById('item').dataset.item);
    }

    getPriceWithProm(price, prom){
        let newPrice = price - (prom * price / 100);
        return newPrice.toFixed(2);
    }

    render() {
        const {isLoaded, product} = this.state;
        if (!isLoaded){
            return (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col">
                            <div className="p-5">
                                <Loader/>
                            </div>
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
                            <div className="d-flex flex-column justify-content-around align-items-center mt-2 mb-2 h-100">
                                <img src={'https://' + window.location.hostname + '/img/' + product.img[0].id} alt={product.name} className="img-thumbnail w-50"/>
                            </div>
                        </div>
                        <div className="col-md-6 col-sm-12">
                            <div className="text-pink bg-grey mb-4">
                                <h1 className="h2 text-center mt-4 p-2">{product.name}</h1>
                                {product.prom ? <h2 className="text-center text-info h2 bg-pink p-2">- {product.prom} %</h2> : '' }
                                <p className="mt-2 p-2">
                                    {product.description}
                                </p>
                                <h2 className="text-center mt-2 mb-2">{product.prom ? this.getPriceWithProm(product.price, product.prom) : product.price} €</h2>
                                <div className="p-3 d-flex justify-content-around align-items-center">
                                    <button className="btn btn-group btn-pink text-info" onClick={this.handleClick}>Ajouter au panier</button>
                                    <a href="/" title="Continuer mes achats" className="btn btn-group btn-pink">Continuer mes achats</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }

}

ReactDOM.render(<Show/>, document.getElementById('item'));
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Loader from "../../common/loader/Loader";
const el = document.getElementById('show-by-cat');
export default class ShowByCat extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            items: null
        }
    }

    componentDidMount(){
        axios.get('/api/subcategory/items/' + el.dataset.id)
            .then(res => {
                this.setState({
                    items: res.data,
                    isLoaded: true
                })
            })
    }

    render() {
        const {isLoaded, items} = this.state;
        if (!isLoaded){
            return (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
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
                    <div className="row mt-4 mb-4 align-items-stretch">
                        {items && items.length > 0 ?
                            items.map(i => {
                                return (
                                    <div className="col-lg-3 col-md-6 col-sm-12 mb-2">
                                        <div className="card h-100">
                                            <img src={'https://' + window.location.hostname + '/img/' + i.img[0].id} className="card-img-top mt-2 mb-2 m-auto" alt={i.img[0].name} />
                                            <div className="card-body bg-pink-inherit d-flex flex-column justify-content-around text-grey">
                                                <h3 className="card-title">{i.name}</h3>
                                                <a href={'/product/' + i.id} className="btn btn-grey">Voir plus</a>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                            : ''}
                    </div>
                </div>
            )
        }
    }
}

ReactDOM.render(<ShowByCat/>, document.getElementById('show-by-cat'));
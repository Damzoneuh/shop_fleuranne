import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Loader from "../../common/loader/Loader";
import Carousel from 'react-bootstrap/Carousel'
import divWithClassName from "react-bootstrap/cjs/divWithClassName";
import CarouselCaption from "react-bootstrap/CarouselCaption";

export default class Index extends Component{
    constructor(props) {
        super(props);
        this.state = {
            proms: null,
            lasts: null,
            isLoaded: false
        }
    }

    componentDidMount(){
        axios.get('/api/prom')
            .then(res => {
                this.setState({
                    proms: res.data,
                });
                axios.get('/api/last')
                    .then(res => {
                        this.setState({
                            lasts: res.data,
                            isLoaded: true
                        })
                    })
            })
    }


    render() {
        const {isLoaded, lasts, proms} = this.state;
        if (!isLoaded){
            return (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="m-auto mt-2 mb-2">
                                <Loader/>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <h1 className="text-grey text-center mt-4">Promotions</h1>
                        <Carousel >
                            {proms && proms.length > 0 ? proms.map(prom => {
                                return (
                                    <Carousel.Item key={prom.id}>
                                        <h2 className="text-grey text-center mt-4">{prom.name}</h2>
                                        <div className="text-center ">
                                            <img src={'https://' + window.location.hostname + '/img/' + prom.img[0].id} className=" d-block w-25 m-auto"/>
                                            <div className="text-center mb-2">
                                                <a href={'/product/' + prom.id} className="btn btn-grey btn-group">Voir plus</a>
                                            </div>
                                            <div className="bg-pink p-3 d-flex align-items-center justify-content-center mb-4">
                                                <span className="line-throw text-danger h4 d-block mb-0 p-2">{prom.price} €</span>
                                                <span className="text-center text-info d-block mb-0 h4 p-2"> - {prom.prom} %</span>
                                                <span className="text-center text-grey d-block h3 mb-0 p-2">{prom.price - prom.price/100 * prom.prom} €</span>
                                            </div>
                                        </div>
                                    </Carousel.Item>
                                )
                                })
                                : ''}
                        </Carousel>
                    </div>
                </div>
                <div className="row mt-2 mb-2 align-items-stretch">
                    <div className="mt-4 mb-4 w-100">
                        <h1 className="text-center text-grey">Nouveautés</h1>
                    </div>
                    {lasts && lasts.length > 0 ?
                        lasts.map(last => {
                            return (
                                <div className="col-lg-3 col-md-6 col-sm-12 mb-2">
                                    <div className="card h-100">
                                        <img src={'https://' + window.location.hostname + '/img/' + last.img[0].id} className="card-img-top mt-2 mb-2 m-auto" alt={last.img[0].name} />
                                        <div className="card-body bg-pink-inherit d-flex flex-column justify-content-around text-grey">
                                            <h3 className="card-title">{last.name}</h3>
                                            <a href={'/product/' + last.id} className="btn btn-grey">Voir plus</a>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                        :''}
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Index/>, document.getElementById('index'));
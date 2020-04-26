import React, {Component} from 'react';
import ReactDom from 'react-dom';

export default class Admin extends Component{
    constructor(props) {
        super(props);

    }

    render() {

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col">
                        <div className="p-5">
                            <div className="bg-grey-inherit p-5 text-center rounded shadow-lg">
                                <a className="m-2 btn btn-group btn-pink" href={window.location.hostname === 'shop.dev.fleuranne.fr' ? 'https://dev.fleuranne.fr/admin' : 'https://fleuranne.fr/admin'}>Mon vitrine</a>
                                <a className="m-2 btn btn-group btn-pink" href={window.location.hostname === 'shop.dev.fleuranne.fr' ? 'https://shop.dev.fleuranne.fr/admin/shop' : 'https://shop.fleuranne.fr/admin/shop'}>Mon e commerce</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDom.render(<Admin/>, document.getElementById('admin'));
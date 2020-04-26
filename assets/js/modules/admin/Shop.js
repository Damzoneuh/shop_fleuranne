import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import AdminNav from "../../common/nav/AdminNav";
import ItemHandler from "./handleItems/ItemHandler";
import Invoice from "./handleInvoices/Invoice";

export default class Shop extends Component{
    constructor(props) {
        super(props);
        this.state = {
            tab: 1,
            subTab: 1
        };

        this.handleSubTab = this.handleSubTab.bind(this);
        this.handleTab = this.handleTab.bind(this);
    }

    handleTab(id){
        this.setState({
            tab: id
        })
    }

    handleSubTab(id){
        this.setState({
            subTab: id
        })
    }

    render() {
        const {tab, subTab} = this.state;
        if (tab === 1){
            return(
                <div>
                    <AdminNav tab={tab} subTab={subTab} handleTab={this.handleTab} handleSubTab={this.handleSubTab}/>
                    <ItemHandler subTab={subTab} />
                </div>

            )
        }
        if (tab === 2){
            return (
                <div>
                    <AdminNav tab={tab} subTab={subTab} handleTab={this.handleTab} handleSubTab={this.handleSubTab}/>
                    <Invoice subTab={subTab} />
                </div>
            )
        }
    }
}

ReactDOM.render(<Shop/>, document.getElementById('admin-shop'));
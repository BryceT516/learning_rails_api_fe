import React, { Component } from 'react';
import axios from 'axios';
import List from '../components/List';
import NewListForm from '../components/NewListForm';
import LoginForm from '../components/LoginForm';


class ListsContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            lists: [],
            authHeaderValues: {},
        }
        this.addNewList = this.addNewList.bind(this)
        this.removeList = this.removeList.bind(this)
        this.login = this.login.bind(this)
        this.logout = this.logout.bind(this)
        
    }
    
    componentDidMount() {

    }
    
    getLists() {
        axios.get('/api/v1/lists', { headers: this.state.authHeaderValues })
            .then(response => {
                this.setState({
                    lists: response.data
                })
            })
            .catch(error => console.log(error))
    }
    
    addNewList(title, excerpt) {
        axios({ method: 'POST', url: '/api/v1/lists', headers: this.state.authHeaderValues, data: { list: {title, excerpt} } })
        .then(response => {
            console.log(response)
            const lists = [...this.state.lists, response.data ]
            this.setState({lists})
        })
        .catch(error => {
            console.log(error)
        })
    }
    
    removeList(list_id) {
        axios.delete('/api/v1/lists/' + list_id, { headers: this.state.authHeaderValues })
        .then(response => {
            console.log(response)
            const lists = this.state.lists.filter(
                list => list.id !== list_id
            )
            this.setState({lists})
        })
        .catch(error => console.log(error))
    }
    
    login(email, password, password_confirmation) {
        return axios.post('api/v1/auth/sign_in', {email: email, password: password})
            .then(response => {
                console.log(response.headers)
                console.log("authHeaderValues:")
                console.log(response.headers["access-token"])
                
                var newHeaderValues = {
                    "access-token": response.headers["access-token"],
                    "client": response.headers["client"],
                    "expiry": response.headers["expiry"],
                    "uid": response.headers["uid"],
                    "token-type": response.headers["token-type"]
                }
                
                this.setState({authHeaderValues: newHeaderValues})
                this.getLists()
            })
            .catch(error => console.log(error))
    }
    
    logout() {
        return axios.delete('api/v1/auth/sign_out', {headers: this.state.authHeaderValues})
        .then(response => {
            console.log(response)
            this.setState({lists: [], authHeaderValues: {}})
        })
        .catch(error => console.log(error))
    }

    ListSection() {
        if(this.state.lists.length > 0) {
            return (
                <div className="Lists-container">
                    {this.state.lists.map( list => {
                        return (
                            <List list={list} onRemoveList={this.removeList} key={list.id} />
                        )
                    })}
                    <NewListForm onNewList={this.addNewList} />
                    <button onClick={this.logout}>Logout</button>
                </div>
            )
        }
        else
        {
            return (
                <div>
                    Please Log In<br />
                    <LoginForm login={this.login} />
                </div>
                
            )
        }
    }

    render() {
        return (
            this.ListSection()
        )
    }
}

export default ListsContainer;

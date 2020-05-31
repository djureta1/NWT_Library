import React, { Component } from 'react'
import axios from 'axios'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import Modal from 'react-modal';

export class Role extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Role: [
                { Uloga: "", obrisati: false }
            ],
            role: [],
            uloga: '',
            modalIsOpen: ''
        };
    }

    componentWillMount() {

        var url = "http://localhost:8081/roles"
        axios.get(url, {
            headers: {
                Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkb2xvcmVzIiwiZXhwIjoxNTkwODI0NjkzLCJpYXQiOjE1OTA3OTU4OTN9.5E2tq4N2qvEonDKvtH-xUuvsI-MlhRJMDcTyuimfyCM"
            }

        }).then((response) => {

            var temp = [];
            for (var i = 0; i < response.data._embedded.roleList.length; i++) {
                temp.push({ name: `${response.data._embedded.roleList[i].name}`, value: response.data._embedded.roleList[i].name, id: response.data._embedded.roleList[i].id });
            }
            this.setState({ role: temp });
        }, (error) => {
            alert("GET" + error)
        });
    }

    handleChange = (e, index) => {
        this.state.role[index].obrisati = true;
    }

    handleChangeId = (e, index) => {
        this.state.id = this.state.role[index].id;
    }

    obrisiRolu = (id) => {
        var url = "http://localhost:8081/roles/" + id;
        console.log(url);
        axios.delete(url, {
            headers: {
                Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkb2xvcmVzIiwiZXhwIjoxNTkwODI0NjkzLCJpYXQiOjE1OTA3OTU4OTN9.5E2tq4N2qvEonDKvtH-xUuvsI-MlhRJMDcTyuimfyCM"
            }

        })
            .then(response => {
                var TEMP = [...this.state.role];
                for (var i = 0; i < TEMP.length; i++) {
                    if (TEMP[i].id === id) TEMP.splice(i, 1);
                }
                this.setState({ role: TEMP })
            }).then(function (response) {
                alert("Uloga uspješno obrisana!");
            })
            .catch(function (error) {
                alert(error);
            });
    }

    kreirajRolu = () => {

 
        axios.post('http://localhost:8081/roles',
            {
                name: this.state.uloga,

            }, {
            headers: {
                Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkb2xvcmVzIiwiZXhwIjoxNTkwODI0NjkzLCJpYXQiOjE1OTA3OTU4OTN9.5E2tq4N2qvEonDKvtH-xUuvsI-MlhRJMDcTyuimfyCM"
            }
        }).then(function (response) {
            alert("Uloga uspješno dodana!");
        })
            .catch(function (error) {
                alert(error);
            });

        var TEMP = [...this.state.role];
        const temp = {
            name: this.state.uloga,
            obrisati: false
        }
        TEMP.push(temp);
        this.setState({ role: TEMP })
    }

    prikazRole() {
        return this.state.role.map((uloga, index) => {
            const { id, name } = uloga
            const brisati = false;
            return (
                <tr key={id}>
                    <td>{name}</td>
                    <td>
                        <button className="btn danger btn-akcija" onClick={e => this.obrisiRolu(id)} > Obrisi</button>
                    </td>
                </tr>
            )
        })
    }

    headerTabele() {
        let header = Object.keys(this.state.Role[0])
        return header.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    unosNovog = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
        return (
            <div className="global">
                <h2 id='title'>Pregled/brisanje uloge</h2>
                <table >
                    <tbody>
                        <tr>{this.headerTabele()}</tr>
                        {this.prikazRole()}
                    </tbody>
                </table>
                <button className="btn success add" onClick={() => this.setState({ modalIsOpen: true })}>Dodaj ulogu</button>
                <Modal isOpen={this.state.modalIsOpen} >
                    <div className="modal">
                        <h2 id='title'>Dodavanje nove uloge</h2>

                        <input type="text"
                            name="uloga"
                            onChange={e => this.unosNovog(e)} />


                    </div>
                    <button type="button" className="btn success add" onClick={this.kreirajRolu}>
                        Dodavanje nove uloge
                    </button>
                    <button className="btn danger close" onClick={() => this.setState({ modalIsOpen: false })}>Zatvori</button>

                </Modal>
            </div>
        )
    }
}

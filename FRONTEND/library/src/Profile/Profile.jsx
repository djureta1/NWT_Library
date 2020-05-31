import React, { Component } from 'react'
import axios from 'axios'
import DatePicker from "react-datepicker";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import "react-datepicker/dist/react-datepicker.css";

export class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Profili: [
                { Ime: "", Prezime: "", DatumRođenja: "", Uloga: "", obrisati: false }
            ],
            profile: [],
            role: [],
            ime: '',
            prezime: '',
            tipRole: '',
            temp: '',
            id: '',
            birthDate: new Date()
        };
        this.wrapper = React.createRef();
    }

    componentWillMount() {
        var url = "http://localhost:8081/profiles"

        axios.get(url, {
            headers: {
                Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkb2xvcmVzIiwiZXhwIjoxNTkwNjIwODMzLCJpYXQiOjE1OTA1OTIwMzN9.UXhalqCMnRhrqXufEI3V5uxKiM03TkAbX3J7iQwzva4"
            }
        }).then((response) => {
           
            var temp = [];
            for (var i = 0; i < response.data._embedded.profileList.length; i++) {
                temp.push({ name: `${response.data._embedded.profileList[i].firstName}`, value: response.data._embedded.profileList[i].firstName,firstName:response.data._embedded.profileList[i].firstName, lastName:response.data._embedded.profileList[i].lastName, birthDate:response.data._embedded.profileList[i].birthDate, roleId:response.data._embedded.profileList[i].role.roleId , roleName:response.data._embedded.profileList[i].role.name, id: response.data._embedded.profileList[i].id });
            }
            
            this.setState({ profile: temp });

        }, (error) => {
            console.log(error)
            alert("GET" + error)
        });
        var url2 = "http://localhost:8081/roles"
        axios.get(url2, {
            headers: {
                Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkb2xvcmVzIiwiZXhwIjoxNTkwNjIwODMzLCJpYXQiOjE1OTA1OTIwMzN9.UXhalqCMnRhrqXufEI3V5uxKiM03TkAbX3J7iQwzva4"
            }

        }).then((response) => {
            
            var temp = [];
            for (var i = 0; i < response.data._embedded.roleList.length; i++) {
                temp.push({ name: `${response.data._embedded.roleList[i].name}`, value: response.data._embedded.roleList[i].name, id: response.data._embedded.roleList[i].id });
            }
            this.setState({ role: temp });
        }, (error) => {
            console.log(error)
            alert("GET" + error)
        });
    }

    handleChange = (e, index) => {
        this.state.profile[index].obrisati = true;
    }

    handleChangeId = (e, index) => {
        this.state.id = this.state.profile[index].id;
    }

    handleChangeDate = date => {
        this.setState({
            birthDate: date
        });
    }

    handleChangeRole = (selectedOption) => {
        if (selectedOption) {
            this.setState({ tipRole: selectedOption.value });
            this.setState({temp:selectedOption});
        }
    }

    obrisiProfil = () => {
        var url="http://localhost:8081/profiles/"+this.state.id;
        console.log(url);
        axios.delete(url,{
            headers: {
                Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkb2xvcmVzIiwiZXhwIjoxNTkwNjIwODMzLCJpYXQiOjE1OTA1OTIwMzN9.UXhalqCMnRhrqXufEI3V5uxKiM03TkAbX3J7iQwzva4"
            }

        })
        .then(response =>{
        var TEMP = [...this.state.profile];
        for (var i = 0; i < TEMP.length; i++) {
            if (TEMP[i].id === this.state.id) TEMP.splice(i, 1);
        }
        this.setState({ profile: TEMP })
        }).then(function (response) {
            alert("Profil uspješno obrisan!");
        })
            .catch(function (error) {
                alert(error);
            });
    }

    kreirajProfile = () => {
        var idRole = -1;
        for (var i = 0; i < this.state.role.length; i++) {
            if (this.state.role[i].value === this.state.tipRole) idRole = this.state.role[i].id;
        }
        console.log(this.state.ime+" "+this.state.prezime+" "+this.state.birthDate+" "+idRole);

        axios.post('http://localhost:8081/profiles',
        {
            firstName: this.state.ime,
            lastName: this.state.prezime,
            birthDate: this.state.birthDate,
            role: {
                id: idRole
            },
            username: "user",
            password: "user"
        }, {
            headers: {
                Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkb2xvcmVzIiwiZXhwIjoxNTkwNjIwODMzLCJpYXQiOjE1OTA1OTIwMzN9.UXhalqCMnRhrqXufEI3V5uxKiM03TkAbX3J7iQwzva4"
            }
        }).then(function (response) {
            alert("Profil uspješno dodan!");
        })
            .catch(function (error) {
                alert(error);
            });

        var TEMP = [...this.state.profile];
        const temp = {
            firstName: this.state.ime,
            lastName: this.state.prezime,
            birthDate: this.state.birthDate,
            role: {
                id: idRole
            },
            username: "user",
            password: "user",
            obrisati: false
        }
        TEMP.push(temp);
        this.setState({ profile: TEMP })
    }

    prikazProfila() {
        return this.state.profile.map((profil, index) => {
            const { firstName, lastName, birthDate, roleId,roleName } = profil
            const brisati = false;
            return (
                <tr key={firstName}>
                    <td>{firstName}</td>
                    <td>{lastName}</td>
                    <td>{birthDate}</td>
                    <td>{roleName}</td>
                    <td>{brisati}
                        <div className="brisanje">
                            <label>
                                <input type="checkbox"
                                    brisati={this.state.checked}
                                    onChange={e => this.handleChangeId(e, index)} />
                            </label>
                        </div>
                    </td>
                </tr>
            )
        })
    }

    headerTabele() {
        let header = Object.keys(this.state.Profili[0])
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
            <div>
                <h2 id='title'>Pregled/brisanje profila</h2>
                <table id='korisnici'>
                    <tbody>
                        <tr>{this.headerTabele()}</tr>
                        {this.prikazProfila()}
                    </tbody>
                </table>
                <div className="footer">
                    <button type="button" className="btn" onClick={this.obrisiProfil}>
                        Obriši profil
                </button>
                </div>
                <div className="forma">
                    <h2 id='title'>Dodavanje novog profila</h2>
                    <div className="form-grupa">
                        <label htmlFor="username">Ime:</label>
                        <input type="text"
                            name="ime"
                            value={this.state.ime}
                            onChange={e => this.unosNovog(e)} />
                    </div>
                    <div className="form-grupa">
                        <label htmlFor="username">Prezime:</label>
                        <input type="text"
                            name="prezime"
                            value={this.state.prezime}
                            onChange={e => this.unosNovog(e)} />
                    </div>
                    <div className="form-grupa">
                        <label htmlFor="username">Datum rođenja:</label>
                        <DatePicker
                            name="birthDate"
                            selected={this.state.startDate}
                            onChange={this.handleChangeDate}
                            showTimeSelect
                            dateFormat="Pp"
                        />
                    </div>
                    <div className="form-grupa" ref={this.wrapper}>
                        <label htmlFor="username">Odaberite ulogu:</label>
                        <Dropdown options={this.state.role}
                            value={this.state.temp}
                            onChange={(e) => {
                                this.handleChangeRole(e);
                            }}
                            placeholder="Odaberite ponuđeni tip uloge"
                        />
                    </div>
                    <button type="button" className="btn" onClick={this.kreirajProfile}>
                        Dodavanje novog profila
                </button>
                </div>
            </div>
        )
    }
}

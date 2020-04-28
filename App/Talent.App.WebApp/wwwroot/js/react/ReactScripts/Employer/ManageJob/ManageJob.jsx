import Cookies from 'js-cookie';
import React from 'react';
import { Card, Dropdown, Icon, Pagination, Popup, Segment, Button, Divider } from 'semantic-ui-react';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import moment from 'moment';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.closeJobById = React.createRef();
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: true,
                showDraft: false,
                showExpired: false,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: "",
            showMore: 2,
            currentPage: 1,
            value: ""
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.showMoreRecord = this.showMoreRecord.bind(this);
        this.buttonGroup = this.buttonGroup.bind(this);
        this.handleSortByDate = this.handleSortByDate.bind(this);
        //your functions go here
    }

    init() {
        console.log("In Init method")
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        //this.setState({ loaderData });//comment this

        //set loaderData.isLoading to false after getting data
        this.loadData(() =>
            this.setState({ loaderData })
        )
    }

    componentDidMount() {
        this.init();
    };

    loadData(callback) {
        var loader = this.state.loaderData;
        var link = 'http://localhost:51689/listing/listing/getSortedEmployerJobs';
        var cookies = Cookies.get('talentAuthToken'); 
       // your ajax call and other logic goes here
        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            data: {
                activePage: 1,
                sortbyDate: this.state.sortBy.date,
                showActive: this.state.filter.showActive,
                showClosed: this.state.filter.showClosed,
                showDraft: this.state.filter.showDraft,
                showExpired: this.state.filter.showExpired,
                showUnexpired: this.state.filter.showUnexpired
            },
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                loader.isLoading = false;
                this.setState({
                    loadJobs: res.myJobs,
                    loaderData: loader
                });
            }.bind(this),
            error: function (res) {
                console.log("in error" + res)
            }
        })
    }

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }

    handleFilter(event) {
        switch (event.currentTarget.textContent) {
            case "Active":
                this.setState((state) => ({
                    filter: Object.assign(state.filter, {
                        showActive: true,
                        showClosed: false,
                        showDraft: false,
                        showExpired: true,
                        showUnexpired: true
                    })
                }), () => { this.loadData() }
                );
                break;
            case "Closed":
                this.setState((state) => ({
                    filter: Object.assign(state.filter, {
                        showActive: false,
                        showClosed: true,
                        showDraft: false,
                        showExpired: true,
                        showUnexpired: true
                    })
                }),() => { this.loadData() }
                );
                break;
            case "Expired":
                this.setState((state) => ({
                    filter: Object.assign(state.filter, {
                        showActive: false,
                        showClosed: true,
                        showDraft: false,
                        showExpired: true,
                        showUnexpired: false
                    })
                }), () => { this.loadData() }
                );
                break;
            case "Unexpired":
                this.setState((state) => ({
                    filter: Object.assign(state.filter, {
                        showActive: true,
                        showClosed: false,
                        showDraft: false,
                        showExpired: false,
                        showUnexpired: true
                    })
                }), () => { this.loadData() }
                );
                break;
            default:
                break;
        }
    }

    showMoreRecord(event, data) {
        console.log(" Clicked " + data.activePage)
        this.setState({
            currentPage: Number(data.activePage)
        });
    }

    buttonGroup(event, data) {

        switch (event.target.name) {
            case "Close":
                console.log("Button -- " + event.target.name)
                this.closeJobById.current.selectJob(event.target.value);
                break;
            case "Copy":
                TalentUtil.notification.show("Job id copied successfully", "success", null, null);
                break;
        }
    }

    handleSortByDate(event) {
        switch (event.currentTarget.textContent) {
            case "New":
                this.setState((state) => ({
                    sortBy: Object.assign(state.sortBy, {
                        date: "desc"
                    })
                }), () => { this.loadData() }
                );
                break;
            case "Old":
                this.setState((state) => ({
                    sortBy: Object.assign(state.sortBy, {
                        date: "asc"
                    })
                }), () => { this.loadData() }
                );
                break;
        }
    }

    checkDate(date) {
        const now = moment();
        if (now.isAfter(date))
            return "red";
        return "green";
    }

    render() {

        let { loadJobs, showMore, currentPage} = this.state;

        let noOfPages = Math.ceil(loadJobs.length / showMore);
        const indexOfLastTodo = currentPage * showMore;
        const indexOfFirstTodo = indexOfLastTodo - showMore;
        const jobs = loadJobs.slice(indexOfFirstTodo, indexOfLastTodo);
       
        let showJobs = jobs.map(
            (job, index) => (
                <div className='row' key={index}>
                    <Card fluid>
                        <Card.Content>
                            <Card.Header>{job.title}</Card.Header>
                            <Card.Meta>
                                <span>
                                    {job.location.city},
                                    {job.location.country}
                                    <br />
                                    {job.expiryDate}
                                </span>
                            </Card.Meta>
                            <Card.Description>
                                {job.summary}
                            </Card.Description>
                        </Card.Content>
                        <Card.Content className='button-container'>
                            <br />
                            <br />
                            <br />
                            <Button className='button-margin' size='small' content="Expired" color={this.checkDate(job.expiryDate)} disabled />
                            <Button.Group
                                onClick={this.buttonGroup}
                                className='button-margin'
                                size='small' floated='right' basic color='blue'>
                                <Button name='Close' value={job.id} icon='close' content='Close' />
                                <Button name='Edit' value={job.id} icon='edit' content='Edit' />
                                <Button name='Copy' value={job.id} icon='copy' content='Copy' />
                            </Button.Group>
                        </Card.Content>
                    </Card>
                    <br />
                </div>
            )
        )

        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui container">
                    <h1>List of Jobs</h1>
                    <div className='rows'>
                        <br/>
                        <div className='row'>
                            <Dropdown text='Filter:'>
                                <Dropdown.Menu>
                                    <Dropdown.Item text='Active' onClick={this.handleFilter} />
                                    <Dropdown.Item text='Closed' onClick={this.handleFilter} />
                                    <Dropdown.Item text='Expired' onClick={this.handleFilter} />
                                    <Dropdown.Item text='Unexpired' onClick={this.handleFilter} />
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>

                        <div className='row'>
                            <Dropdown text='Sort by date: '>
                                <Dropdown.Menu>
                                    <Dropdown.Item text='New' value='desc' onClick={this.handleSortByDate} />
                                    <Dropdown.Item text='Old' value='asc' onClick={this.handleSortByDate} />
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                    <div className='rows'>
                        <br />
                        <br />
                        {showJobs}
                    </div>
                    <div className='pagination'>
                        <Pagination onPageChange={this.showMoreRecord} defaultActivePage={1} totalPages={noOfPages} />
                    </div>
                    <br />
                    <br />
                    <JobSummaryCard
                        ref={this.closeJobById}
                        loadData={this.loadData}
                    />
                </div>
            </BodyWrapper>
        )
    }
}
import React from 'react';
import Cookies from 'js-cookie';
import { Popup } from 'semantic-ui-react';
import moment from 'moment';

export class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);
        this.selectJob = this.selectJob.bind(this)
    }

    selectJob(idClose) {
        console.log("Job Summary  -- " + idClose )
        var cookies = Cookies.get('talentAuthToken');
        //url: 'http://localhost:51689/listing/listing/closeJob',

        $.ajax({
            url: 'http://localhost:51689/listing/listing/closeJob',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(idClose),
            success: function (res) {
                this.props.loadData();
                TalentUtil.notification.show(res.message, "success", null, null);
            }.bind(this),
            error: function (res) {
                TalentUtil.notification.show(res.message, "error", null, null)
            }
        })
    }

    render() {
        return null;
    }
}
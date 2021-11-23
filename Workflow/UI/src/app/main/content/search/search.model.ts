import { FuseUtils } from '../../../core/fuseUtils';
import { DatePipe } from '@angular/common';

export class ProfileSearchCriteria {
    userid: string;
    jobid: number;
    headline: string;
    title: string;
    location: string;
    skill1: string;
    skill2: string;
    skill3: string;
    searchstring: string;
    searchengine: string;
    isjobseeker: boolean;
    isoverride: boolean;

    formattedtitle: string;

    constructor(criteria) {
        this.userid = criteria.userid || null;
        this.jobid = criteria.jobid || null;
        this.headline = criteria.headline || '';
        this.title = criteria.title || '';
        this.location = criteria.location || '';
        this.skill1 = criteria.skill1 || '';
        this.skill2 = criteria.skill2 || '';
        this.skill3 = criteria.skill3 || '';
        this.searchstring = criteria.searchstring || '';
        this.searchengine = criteria.searchengine || '';
        this.isjobseeker = criteria.isjobseeker || false;
        this.isoverride = criteria.isoverride || false;

        this.formattedtitle = criteria.formattedtitle || '';
    }
}

export class ProfileSearchResult {
    resultCount: number;
    profiles: Profile[];

    constructor(response) {
        this.resultCount = response.resultCount || 0;
        this.profiles = response.profiles || [];
    }
}

export class Profile {
    title: string;
    link: string;
    snippet: string;
    applicationname: string;

    constructor(response) {
        this.title = response.title || '';
        this.link = response.link || '';
        this.snippet = response.snippet || '';
        this.applicationname = response.applicationname || '';
    }
}

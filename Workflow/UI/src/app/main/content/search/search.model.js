"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ProfileSearchCriteria = /** @class */ (function () {
    function ProfileSearchCriteria(criteria) {
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
    return ProfileSearchCriteria;
}());
exports.ProfileSearchCriteria = ProfileSearchCriteria;
var ProfileSearchResult = /** @class */ (function () {
    function ProfileSearchResult(response) {
        this.resultCount = response.resultCount || 0;
        this.profiles = response.profiles || [];
    }
    return ProfileSearchResult;
}());
exports.ProfileSearchResult = ProfileSearchResult;
var Profile = /** @class */ (function () {
    function Profile(response) {
        this.title = response.title || '';
        this.link = response.link || '';
        this.snippet = response.snippet || '';
        this.applicationname = response.applicationname || '';
    }
    return Profile;
}());
exports.Profile = Profile;

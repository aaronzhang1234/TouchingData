var Dao     = require("../app/DAO.js");
let sqlDatabaseName = "data/POLITICS_OF_THE_GRID.db";
var dao = new Dao(sqlDatabaseName);

var assert = require('assert');

var Website = require("../app/models/Website.js");
var Recipient =require("../app/models/Recipient.js");
var Award = require("../app/models/Award.js");

describe('Dao', function() {
	describe('#insertRecipient()', function() {
		it('should insert a recipient record', function(){
			let recipient = new Recipient(null,"nate","123 st", null, "city", null, null, null, null, null, null)
			let id = dao.insertRecipient(recipient);
			recipient = dao.selectRecipientById(id);
			console.log(recipient)
			assert.notEqual(recipient.id, null)
			assert.notEqual(dao.deleteRecipient(recipient.id),false)
		});
	});
});

describe('Dao', function() {
	describe('#insertAward()', function() {
		it('should insert an Award record', function(){
			let award = new Award(5,"2019",1, 235, 500, null, null, null)
			try{
				award = dao.insertAward(award);
			}catch(err){
				console.log(err);
			}
			assert.notEqual(award, null);
		});
	});
});

//describe('Dao', function() {
//	describe('#selectRecAndParents()', function() {
//		it('should return an array of recipients and their parents', function(){
//			let records = (dao.selectRecAndParents());
//			records.forEach(function(record, i){
//				if (record[0].placeOfPerformance != null){
//					//assert.equal(record[0].placeOfPerformance, record[1].id)
//				}
//			});
//		});
//	});
//});

describe('Dao', function() {
	describe('#insertWebsite()', function() {
		it('should create a website', function(){
			let url = "https://www.test.com"
			let website = new Website(null,url)
			dao.insertWebsite(website);
			website = dao.selectWebsiteByDomain(url);
			assert.equal(url, website.domain);
		});
	});
});

//describe('Dao', function() {
//	describe('#selectAllRecipients()', function() {
//		it('should select all columns and return all records from recipient table', function(){
//			let website = new Website(null,url)
//			dao.insertWebsite(website);
//			website = dao.selectWebsite(url);
//			assert.equal(url, website.domain);
//		});
//	});
//});

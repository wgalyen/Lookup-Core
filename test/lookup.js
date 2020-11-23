'use strict';

/*jshint expr: true*/

// Modules
var path   = require('path');
var chai   = require('chai');
var expect = chai.expect;
var lookup = require('../lib/lookup.js');

chai.should();
chai.config.truncateThreshold = 0;

describe('#cleanString()', function () {

    it('converts "Hello World" into "hello-world"', function () {
        lookup.cleanString('Hello World').should.equal('hello-world');
    });

    it('converts "/some/directory-example/hello/" into "some-directory-example-hello"', function () {
        lookup.cleanString('/some/directory-example/hello/').should.equal('some-directory-example-hello');
    });

    it('converts "with trailing space " into "with-trailing-space"', function () {
        lookup.cleanString('with trailing space ').should.equal('with-trailing-space');
    });

    it('converts "also does underscores" into "also_does_underscores"', function () {
        lookup.cleanString('also does underscores', true).should.equal('also_does_underscores');
    });

    it('converts "/some/directory-example/underscores/" into "some_directory_example_underscores"', function () {
        lookup.cleanString('/some/directory-example/underscores/', true).should.equal('some_directory_example_underscores');
    });

});

describe('#slugToTitle()', function () {

    it('converts "hello-world" into "Hello World"', function () {
        lookup.slugToTitle('hello-world').should.equal('Hello World');
    });

    it('converts "dir/some-example-file.md" into "Some Example File"', function () {
        lookup.slugToTitle('dir/some-example-file.md').should.equal('Some Example File');
    });

});

describe('#processMeta()', function () {

    it('returns array of meta values', function () {
        var result = lookup.processMeta('/*\n'+
            'Title: This is a title\n'+
            'Description: This is a description\n'+
            'Sort: 4\n'+
            'Multi word: Value\n'+
            '*/\n');
        expect(result).to.have.property('title', 'This is a title');
        expect(result).to.have.property('description', 'This is a description');
        expect(result).to.have.property('sort', '4');
        expect(result).to.have.property('multi_word', 'Value');
    });

    it('returns an empty array if no meta specified', function () {
        var result = lookup.processMeta('no meta here');
        expect(result).to.be.empty;
    });

    it('returns proper meta from file starting with a BOM character', function () {
        lookup.config.content_dir = path.join(__dirname, 'content/');
        var result = lookup.getPage(path.join(lookup.config.content_dir, 'page-with-bom.md'));
        expect(result).to.have.property('title', 'Example Page With BOM');
    });

    it('returns array of meta values (YAML)', function () {
        var result = lookup.processMeta('\n'+
            'Title: This is a title\n'+
            'Description: This is a description\n'+
            'Sort: 4\n'+
            'Multi word: Value\n'+
            '---\n');
        expect(result).to.have.property('title', 'This is a title');
        expect(result).to.have.property('description', 'This is a description');
        expect(result).to.have.property('sort', '4');
        expect(result).to.have.property('multi_word', 'Value');
    });

    it('returns proper meta from file starting with a BOM character (YAML)', function () {
        lookup.config.content_dir = path.join(__dirname, 'content/');
        var result = lookup.getPage(lookup.config.content_dir + 'page-with-bom-yaml.md');
        expect(result).to.have.property('title', 'Example Page With BOM for YAML');
    });

});

describe('#stripMeta()', function () {

    it('strips meta comment block', function () {
        var result = lookup.stripMeta('/*\n'+
            'Title: This is a title\n'+
            'Description: This is a description\n'+
            'Sort: 4\n'+
            'Multi word: Value\n'+
            '*/\nThis is the content');
        result.should.equal('This is the content');
    });

    it('leaves content if no meta comment block', function () {
        var result = lookup.stripMeta('This is the content');
        result.should.equal('This is the content');
    });

    it('only strips the first comment block', function () {
        var result = lookup.stripMeta('/*\n'+
            'Title: This is a title\n'+
            'Description: This is a description\n'+
            'Sort: 4\n'+
            'Multi word: Value\n'+
            '*/\nThis is the content/*\n'+
            'Title: This is a title\n'+
            '*/');
        result.should.equal('This is the content/*\n'+
            'Title: This is a title\n'+
            '*/');
    });

});

describe('#processVars()', function () {

    it('replaces config vars in Markdown content', function () {
        lookup.config.base_url = '/base/url';
        lookup.processVars('This is some Markdown with a %base_url%.')
            .should.equal('This is some Markdown with a /base/url.');
    });

});

describe('#getPage()', function () {

    it('returns an array of values for a given page', function () {
        lookup.config.content_dir = path.join(__dirname, 'content/');
        var result = lookup.getPage(lookup.config.content_dir + 'example-page.md');
        expect(result).to.have.property('slug', 'example-page');
        expect(result).to.have.property('title', 'Example Page');
        expect(result).to.have.property('body');
        expect(result).to.have.property('excerpt');
    });

    it('returns null if no page found', function () {
        lookup.config.content_dir = path.join(__dirname, 'content/');
        var result = lookup.getPage(lookup.config.content_dir + 'nonexistent-page.md');
        expect(result).to.be.null;
    });

});

describe('#getPages()', function () {

    it('returns an array of categories and pages', function () {
        lookup.config.content_dir = path.join(__dirname, 'content/');
        var result = lookup.getPages();
        expect(result[0]).to.have.property('is_index', true);
        expect(result[0].files[0]).to.have.property('title', 'Example Page');
        expect(result[1]).to.have.property('slug', 'sub');
        expect(result[1].files[0]).to.have.property('title', 'Example Sub Page');
    });

    it('marks activePageSlug as active', function () {
        lookup.config.content_dir = path.join(__dirname, 'content/');
        var result = lookup.getPages('/example-page');
        expect(result[0].files[0]).to.have.property('active', true);
        expect(result[1].files[0]).to.have.property('active', false);
    });

});

describe('#doSearch()', function () {

    it('returns an array of search results', function () {
        lookup.config.content_dir = path.join(__dirname, 'content/');
        var result = lookup.doSearch('example');
        expect(result).to.have.length(4);
    });

    it('returns an empty array if nothing found', function () {
        lookup.config.content_dir = path.join(__dirname, 'content/');
        var result = lookup.doSearch('asdasdasd');
        expect(result).to.be.empty;
    });

});

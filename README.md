A sample [AngularJS](http://angularjs.org)
[app](https://github.com/EmmanuelOga/simple-angular-rails-app/)
which uses [rails](http://rubyonrails.org/) as a backend.

* [The running app](http://morning-chamber-9005.herokuapp.com/#/) on all its glory.
* Github [repository](https://github.com/EmmanuelOga/simple-angular-rails-app/).

While it is possible to include AngularJS as part of the rails assets, I
think it is better to setup the angular code base <strong>on a
standalone folder</strong>, leaving the rails app as a (more or less)
isolated backend.

There are several advantages to this setup:

* Ability to manage the frontend app using
  [Yeoman](http://yeoman.io/)
  (including [generators](https://github.com/yeoman/generator-angular#readme)!).
* No more questions about file layout: use rails layout for rails stuff,
  angular-generator layout for angular stuff.
* Easily install external assets via [bower](http://bower.io/) (e.g.
  angularjs, jquery, twitter bootstrap, underscore, etc.).
* Write client side unit tests and run them with
  [karma](http://karma-runner.github.com).
* Promotes unit-testing the js codebase and removes the temptation of
  integration-testing everything: testing with karma is a lot faster
  than using capybara or a similar solution.
* [LiveReload](http://livereload.com/) support for free with yeoman's
  angular generator! (uses websockets, no need to install a browser plugin).

## Yeoman, Bower, Livereload and Karma Runner.

I want to stress out the convinience of working on your frontend using
the stack yeoman sets up for you. By keeping the frontend isolated from
the backend you get an amazingly fast development environment and draw a
clear line between backend and frontend (great for making sure you are
writing the right unit/integration tests).
Yeoman sets up the test environment for you using jasmine as the testing
library and karma as the runner. karma is possibly the [fastest and most
complete js test runner](http://www.youtube.com/watch?feature=player_detailpage&v=Mb3_oT8ZreI&t=11) out
there. And it is very well integrated with angular.

<iframe width="560" height="315" src="//www.youtube.com/embed/Mb3_oT8ZreI&t=11" frameborder="0" allowfullscreen></iframe>

The experience of coding with Livereload is simply amazing. Immediate
feedback for every little addition you save in your code editor while
you are working, without having to reload the page in the browser!

True: you can [use livereload with rails](https://github.com/guard/guard-livereload) alone, and you
can [use bower with rails too](http://dev.af83.com/2013/01/02/managing-rails-assets-with-bower.html).
But Yeoman's angular generator sets everything right for you with a
single command.

Rails was born in the request-response era of web applications, and it
shows. Yeoman sets up a web environment with defaults that are better
suited for developing web applications.

## Setting the environment up

You'll need:

* ruby 1.9.3 ([rvm](https://rvm.io/) recommended for installation)
* node 0.10.13 ([nvm](https://github.com/creationix/nvm) recommended for installation)
* Two shell sessions!

### Session one: the rails backend:

```
rvm use 1.9.3
git clone https://github.com/EmmanuelOga/simple-angular-rails-app.git
cd simple-angular-rails-app
bundle install
bundle exec rails s -p 3000
```

**NOTE**:  the angular application was generated using these commands.

```
npm install -g yo generator-angular
mkdir ngapp; cd ngapp
yo angular notes
```

### Session two: a grunt server

```
nvm use 0.10.13
cd simple-angular-rails-app/ngapp
npm install -g grunt-cli
npm install
bower install
grunt server # opens a browser window... you are done!
```

## What's going on?

During development, you need to run both the rails app and the grunt
server. The reason is the html client was written as if the rails
backend was an isolated, independent service, using
[Yeoman](http://yeoman.io/) to scaffold the project.

The intent is to **simulate** that the whole environment is a single web
application. An, indeed, before deploying to prod we'll be consolidating
the whole angular app as static assets in rails' public/ folder.

Here's a diagram of the stack during development:

![Application Layout](https://raw.github.com/EmmanuelOga/simple-angular-rails-app/master/doc/layout.jpg "Application Layout")

The grunt server task
[proxies](http://github.com/EmmanuelOga/simple-angular-rails-app/blob/master/ngapp/Gruntfile.js#L65-L71)
any url with path /api to the rails backend on localhost:3000.

Rails is used in the backend, but really any web framework would be ok
here ([sinatra](http://www.sinatrarb.com/) would make a lot more sense
for my silly example app!).

## TESTING

To run both the backend tests and front end tests, you can run:

```
rake test PHANTOMJS_BIN=`which phantomjs`
```

This is done by [reopening rails's test
task](https://github.com/EmmanuelOga/simple-angular-rails-app/blob/master/Rakefile#L8-L10)
and adding a step to run the karma runner. This design is a bit
simplistic but it works. You may want to have something a bit more
elaborate to make it so angular's tests are run even if rails tests fail
to complete.

The PHANTOMJS_BIN env var is needed because the project configures karma
to use [phantom js](http://www.phantomjs.org), but it could be changed
to run any other browser.

karma can be
[configured](https://github.com/EmmanuelOga/simple-angular-rails-app/blob/master/ngapp/karma.conf.js#L40)
to watch the tests as opposed to do a single run. You should
deffinitively look into that during development.

## Deploying

If you run `grunt build`, grunt will package the whole angular app in a
tidy package on the rails public/ folder. This packaging step could
happen in the server to avoid having to commit the generated assets in
your repository, analogous to how it is done for generating assets with
rails' assets pipeline.

## XSRF support

The rails app sets the XSRF token in the cookies. The cookies are
accessible even when using the proxy because the port is [not taken into
account](http://stackoverflow.com/questions/1612177/are-http-cookies-port-specific)
when restricting access to the cookies.

Check
[ApplicationController](http://github.com/EmmanuelOga/simple-angular-rails-app/blob/master/app/controllers/application_controller.rb)
for some notes on the XSRF protection.

# &lt;polymer-ui-carousel&gt;

A [Polymer](http://www.polymer-project.org) carousel element

> Maintained by [Addy Osmani](https://github.com/addyosmani).

## Demo

> [Demo 1](http://addyosmani.github.io/polymer-ui-carousel/smoke.html) and [Demo 2](http://addyosmani.github.io/polymer-ui-carousel/smoke-labels.html).

<img src="https://f.cloud.github.com/assets/110953/2293457/8f385680-a06d-11e3-89b3-1201463d92f5.png" width="340"/>

<img src="https://f.cloud.github.com/assets/110953/2293458/8f54146a-a06d-11e3-8f1b-c0ac1fe95d4b.png" width="340"/>


## Install

Install with [Bower](http://bower.io):

```sh
$ bower install --save polymer-ui-carousel
```

## Usage

1. Import Web Components' polyfill:

```html
<script src="platform.js"></script>
```

2. Import Custom Element:

```html
<link rel="import" href="polymer-ui-carousel.html">
```

3. Start using it!

With bullet controls:

```html
  <polymer-ui-carousel>
    <div>One</div>
    <div>Two</div>
    <div>Three</div>
    <div>Four</div>
    <div>Five</div>
  </polymer-ui-carousel>
```

With text label controls:

```html
  <polymer-ui-carousel labels="true">
    <div title="Alpha">One</div>
    <div title="Beta">Two</div>
    <div title="Gamma">Three</div>
    <div title="Delta">Four</div>
    <div title="Epsilon">Five</div>
  </polymer-ui-carousel>
```

## Examples


## Setup

In order to run it locally you'll need a basic server setup.

1. Install [Node.js](http://nodejs.org/download/)
2. Install [Grunt](http://gruntjs.com/):

    ```sh
    $ npm install --global grunt-cli
    ```

3. Install local dependencies:

    ```sh
    $ npm install
    ```

4. Run a local server and open `http://localhost:8000`.

    ```sh
    $ grunt connect
    ```

## Options

Attribute  | Options                   | Default             | Description
---        | ---                       | ---                 | ---
`textLabels`      | *boolean*                  | `false`               | use custom text labels instead of the default bullet controls


## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

For detailed changelog, check [Releases](https://github.com/addyosmani/polymer-ui-carousel/releases).

## License

[MIT License](http://opensource.org/licenses/MIT)

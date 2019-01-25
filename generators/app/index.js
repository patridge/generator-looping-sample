'use strict';

const Generator = require('yeoman-generator');
const yosay = require('yosay');
const path = require('path');

const generatorName = "Generator Looping Spike"

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.outputConfig = Object.create(null);
    }

    initializing() {
        this.log(yosay('Welcome to the ' + generatorName + '!'));
    }

    prompting() {
        const generator = this;
        generator.outputConfig.things = [];
        const prompts = {
            askForFirstInput: () => {
                return generator.prompt({
                    type: 'input',
                    name: 'firstInput',
                    message: 'What\'s the first input?',
                }).then(answers => {
                    generator.outputConfig.things.push({
                        firstThing: answers.firstInput,
                    });
                });
            },
        };

        // Ask prompt system borrowed from VS Code extension generator.
        // Run all prompts in sequence. Results can be ignored.
        let result = Promise.resolve();
        for (let taskName in prompts) {
            let prompt = prompts[taskName];
            result = result.then(_ => {
                return new Promise((s, r) => {
                    setTimeout(_ => prompt().then(s, r), 0); // set timeout is required, otherwise node hangs
                });
            })
        }
        return result;
    }

    writing() {
        // Set up context for `copyTpl` template values.
        const context = this.outputConfig;

        this.sourceRoot(path.join(__dirname, './templates/looping-sample'));
        this.fs.copyTpl(this.sourceRoot() + '/things.yml', 'things.yml', context);
    }
};
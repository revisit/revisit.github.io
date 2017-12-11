'use strict';

/* * * * * * * * * *
 ~ Project Revisit  ~
 * * * * * * * * * */

/* ------------------------------------------------------------------------
 * main.js:
 * ------------------------------------------------------------------------
 *  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Project
 * Contributors: Michael Brattin,
 *               Kyle Finter,
 *               Garren Ijames,
 *               Brett Spatz,
 *               Jesse Stewart
 *
 * Date Last Modified: 11-29-2017
 * Description:
 *      Create a controls object that will set up all of the event listeners
 * for the application. Add this controls object to an application object
 * add application object to the global namespace for potential use by other
 * application components.
 *
 */

const revisit = window['revisit'] || {};

revisit.controls = Controls();

revisit.start = function()
{
        this.controls.init();
};

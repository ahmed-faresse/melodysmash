/// <reference path="../../_definitions.ts" />

/**
* @author       Richard Davey <rich@photonstorm.com>
* @author       sole (http://soledadpenades.com), tween.js
* @copyright    2013 Photon Storm Ltd.
* @license      https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
* @module       Phaser
*/
module Phaser.Easing {

    /**
    * Exponential easing methods.
    *
    * @class Exponential
    */
    export class Exponential {

        /**
        * The In ease method.
        *
        * @method In
        * @param {Number} k The value to ease.
        * @return {Number} The eased value.
        */
        public static In(k) {

            return k === 0 ? 0 : Math.pow(1024, k - 1);

        }

        /**
        * The Out ease method.
        *
        * @method Out
        * @param {Number} k The value to ease.
        * @return {Number} The eased value.
        */
        public static Out(k) {

            return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);

        }

        /**
        * The InOut ease method.
        *
        * @method InOut
        * @param {Number} k The value to ease.
        * @return {Number} The eased value.
        */
        public static InOut(k) {

            if (k === 0) return 0;
            if (k === 1) return 1;
            if ((k *= 2) < 1) return 0.5 * Math.pow(1024, k - 1);
            return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);

        }

    }

}

<?php
/**
 * 
 */
namespace yii2fullcalendarscheduler;

use yii\web\AssetBundle;

/**
 * 
 */
class TimetrackerAsset extends AssetBundle
{
    /**
     * [$sourcePath description]
     * @var string
     */
    public $sourcePath = __DIR__ . '/js';

    /**
     * [$js description]
     * @var array
     */
    public $js = [
        'timetracker.js'
    ];

}

<?php

use Invobox\RandomizedCounter\CounterDataUpdater;

include "vendor/autoload.php";

$config = array(
	'hourlyMinimumIncrease' => 13000,
	'hourlyMaximumIncrease' => 14000,
	'counterOffset'         => 10,
	'counterDataFilePath'   => 'example/counterData.json',
);

$counterFileUpdater = new CounterDataUpdater( $config );
$counterFileUpdater->updateCounterData();
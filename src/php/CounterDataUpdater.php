<?php

namespace Invobox\RandomizedCounter;

class CounterDataUpdater {
	
	/**
	 * @var int
	 */
	private $hourlyMinimumIncrease = 13000;
	
	/**
	 * @var int
	 */
	private $hourlyMaximumIncrease = 14000;
	
	/**
	 * @var int
	 */
	private $startNumber = 21999444;
	
	/**
	 * @var int
	 */
	private $counterIncreaseNumber;
	
	/**
	 * @var int
	 */
	private $currentIterationNumber;
	
	/**
	 * @var int
	 */
	private $counterOffset = 10;
	
	/**
	 * @var string
	 */
	private $counterDataFilePath;
	
	/**
	 * CounterDataUpdater constructor.
	 *
	 * @param array $config
	 */
	public function __construct( $config = array() ) {
		
		if ( $config['hourlyMaximumIncrease'] ) {
			$this->hourlyMaximumIncrease = $config['hourlyMaximumIncrease'];
		}
		
		if ( $config['hourlyMinimumIncrease'] ) {
			$this->hourlyMinimumIncrease = $config['hourlyMinimumIncrease'];
		}
		
		if ( $config['counterOffset'] ) {
			$this->counterOffset = $config['counterOffset'];
		}
		
		$this->counterDataFilePath = $config['counterDataFilePath'];
		
		$this->counterIncreaseNumber = rand( $this->hourlyMinimumIncrease, $this->hourlyMaximumIncrease );
	}
	
	public function updateCounterData() {
		$fileHandle = fopen( $this->counterDataFilePath, 'w' );
		fwrite( $fileHandle, json_encode( $this->generateData() ) );
		fclose( $fileHandle );
	}
	
	/**
	 * @return \stdClass
	 */
	private function generateData() {
		$newData = new \stdClass();
		
		$newData->startNumber            = $this->startNumber;
		$newData->currentIterationNumber = $this->getNextIterationNumber();
		$newData->numberForTimestamp     = array();
		
		$numberIncrease = 0;
		for ( $i = 0; $i < 60; $i ++ ) {
			for ( $j = 0; $j < 60; $j ++ ) {
				$numberIncrease += (int) ( $this->counterIncreaseNumber / 3600 + rand( 0, $this->counterOffset ) );
				$newData->numberForTimestamp[ $this->getTimestampKey( $i, $j ) ] = $newData->currentIterationNumber + $numberIncrease;
			}
		}
		
		var_dump( $newData );
		
		return $newData;
	}
	
	private function getTimestampKey( $i, $j ) {
		return gmdate( 'YmdH' ) .
		       str_pad( $i, 2, '0', STR_PAD_LEFT ) .
		       str_pad( $j, 2, '0', STR_PAD_LEFT );
	}
	
	/**
	 * @return int
	 */
	private function getNextIterationNumber() {
		if ( ! $this->currentIterationNumber ) {
			$this->currentIterationNumber = $this->startNumber;
		}
		
		return $this->currentIterationNumber + $this->counterIncreaseNumber;
	}
	
}
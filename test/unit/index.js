var test = require('tap').test,
nodeo = require(__dirname + '/../../lib/nodeo.js');

var utils = nodeo.utils,
ops = nodeo.ops; 

var population_size = 16;
var chromosome_size = 32;
var population = new Array([]);
var fitness_of = new Object({});
var tournament_size = 3;
var pool_size = population_size;

test('loads', function (t) {
         t.ok(nodeo, 'Loaded OK');
         t.end();
     });

test('chromosomes', function (t) {
	 for ( var i = 0; i < population_size; i ++ )  {
	     var chromosome = utils.random( chromosome_size );
	     population.push( chromosome );
	     t.equal(chromosome.length, chromosome_size, "Length " + chromosome + " OK" );
	     var is_match = chromosome.match(/[01]+/g );
	     t.ok(is_match, "Binary");
             fitness_of[chromosome] =  utils.max_ones( chromosome );
	     t.ok( fitness_of[chromosome] >= 0, "fitness" );
	     var new_chromosome = ops.mutate(chromosome);
	     t.ok( new_chromosome !== chromosome, "mutation " + chromosome + " - " + new_chromosome);
	     var to_cross = ops.invert( chromosome );
	     t.ok( to_cross.charAt(0) !== chromosome.charAt(0), "invert" ); // might be the same...
	     var crossed = ops.crossover( to_cross, chromosome );
	     t.ok( crossed[0] !== chromosome, "Crossed" );
	     t.ok( crossed[1] !== to_cross, "Crossed" );
	 }

         t.end();
});

test('Nodeo', function(t) {
    var eo = new nodeo.Nodeo( { population_size: population_size,
				chromosome_size: chromosome_size,
				fitness_func: utils.max_ones } );
    console.log(eo);
    t.ok( eo, "Tipo");
    
    var chosen = eo.tournament_selection( tournament_size, pool_size);
    t.equal( chosen.length, pool_size, "Size OK");
    var new_population = ops.reproduction( chosen);
    t.equal( new_population.length, population_size, "Size OK");
    eo.generation();
    var the_best = eo.population[0];
    var the_best_fitness = eo.fitness_of[the_best];
    eo.generation();
    t.ok( eo.fitness_of[eo.population[0]] >= the_best_fitness, "Improving fitness" );
    var chromosome = utils.random( chromosome_size );
    eo.incorporate( chromosome );
    t.equal( new_population.length, population_size, "Size OK");
    do {
	eo.generation();
    } while ( eo.fitness_of[eo.population[0]] < chromosome_size );
    t.equal(eo.fitness_of[eo.population[0]], chromosome_size, "Finished EA" );
    t.end();
});



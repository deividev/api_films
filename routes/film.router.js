const logger = require('logger');
const Router = require('@koa/router');

let films = [];
let nextId = 0;

class FilmRouter {
    static async get(ctx) {
        logger.info('Obtaining all films');
        ctx.body = films;
    }

    static async getById(ctx) {
        
    }

    static async create(ctx) {
        logger.info(`Creating new film with body ${ctx.request.body}`);
        const film = ctx.request.body;
        film.id = nextId++;films.push(film);
        ctx.body = film;
        ctx.status = 201;
    }

    static async update(ctx) {
        
    }

    static async delete(ctx) {
        
    }
}

const router = new Router({prefix: '/film'});
router.get('/', FilmRouter.get);
router.get('/:id', FilmRouter.getById);
router.post('/', FilmRouter.create);
router.put('/:id', FilmRouter.update);
router.delete('/:id', FilmRouter.delete);

module.exports = router;
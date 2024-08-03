const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const { getAsync, setAsync } = require('../redis')

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })

  const count = Number(await getAsync("count")) + 1
  await setAsync("count", count)

  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.send(await req.todo);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const id = await req.todo.id
  const singleTodo = {
    id,
    text: await req.body.text,
    done: await req.body.done
  }

  await Todo.findByIdAndUpdate(id, singleTodo)
  res.send(singleTodo);
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;

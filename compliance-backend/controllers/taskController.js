const Task = require('../models/Task');
const Control = require('../models/Control');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllTasks = catchAsync(async (req, res, next) => {
  const filter = { userId: req.user.id };
  
  if (req.query.status) {
    filter.status = req.query.status;
  }
  
  if (req.query.priority) {
    filter.priority = req.query.priority;
  }

  const tasks = await Task.find(filter)
    .populate({
      path: 'controlId',
      select: 'title controlId'
    })
    .sort({ dueDate: 1 });

  res.status(200).json({
    status: 'success',
    results: tasks.length,
    data: {
      tasks
    }
  });
});

exports.getTask = catchAsync(async (req, res, next) => {
  const task = await Task.findOne({
    _id: req.params.id,
    userId: req.user.id
  }).populate({
    path: 'controlId',
    select: 'title controlId category subCategory'
  });

  if (!task) {
    return next(new AppError('Aucune tâche trouvée avec cet ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      task
    }
  });
});

exports.createTask = catchAsync(async (req, res, next) => {
  // Vérifier que le contrôle existe si spécifié
  if (req.body.controlId) {
    const control = await Control.findById(req.body.controlId);
    if (!control) {
      return next(new AppError('Aucun contrôle trouvé avec cet ID', 404));
    }
  }

  const taskData = {
    userId: req.user.id,
    controlId: req.body.controlId,
    title: req.body.title,
    description: req.body.description,
    dueDate: req.body.dueDate,
    priority: req.body.priority || 'medium'
  };

  const task = await Task.create(taskData);

  res.status(201).json({
    status: 'success',
    data: {
      task
    }
  });
});

exports.updateTask = catchAsync(async (req, res, next) => {
  const task = await Task.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.user.id
    },
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!task) {
    return next(new AppError('Aucune tâche trouvée avec cet ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      task
    }
  });
});

exports.deleteTask = catchAsync(async (req, res, next) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!task) {
    return next(new AppError('Aucune tâche trouvée avec cet ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.completeTask = catchAsync(async (req, res, next) => {
  const task = await Task.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.user.id
    },
    { status: 'completed' },
    {
      new: true,
      runValidators: true
    }
  );

  if (!task) {
    return next(new AppError('Aucune tâche trouvée avec cet ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      task
    }
  });
});
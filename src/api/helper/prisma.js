const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const prismaQueriesPool = []

module.exports.create = async (modelName, data) => {
  try {
    const newRecord = await prisma[modelName].create({
      data,
    })
    return newRecord
  } catch (error) {
    throw error
  }
}

module.exports.createWithoutExecute = (modelName, data) => {
  try {
    return prisma[modelName].create({
      data,
    })
  } catch (error) {
    throw error
  }
}

module.exports.readWithPaginationOrId = async (modelName, id, page = 1) => {
  try {
    let result
    if (id) result = await prisma[modelName].findFirst({ where: { id } })
    else {
      const skip = (page - 1) * 20
      result = await prisma[modelName].findMany({ skip, take })
    }
    return result
  } catch (error) {
    throw error
  }
}

module.exports.readRecordsSortedByDateWithPagination = async (
  modelName,
  take,
  page = 1,
  orderBy = {
    date: "asc",
  }
) => {
  try {
    const skip = (page - 1) * take
    const records = await prisma[modelName].findMany({
      skip,
      take,
      orderBy,
    })
    return records
  } catch (error) {
    throw error
  }
}

module.exports.readWithPagination = async (modelName, page = 1, orderBy) => {
  try {
    let result
    if (orderBy) result = await prisma[modelName].findMany({ skip, take })
    else {
      const skip = (page - 1) * 10
      result = await prisma[modelName].findMany({ skip, take, orderBy })
    }
    return result
  } catch (error) {
    throw error
  }
}

module.exports.readOne = async (modelName, where, select) => {
  try {
    let result
    if (select) result = await prisma[modelName].findFirst({ where, select })
    else result = await prisma[modelName].findFirst({ where })

    return result
  } catch (error) {
    throw error
  }
}

module.exports.readAll = async (modelName, where, select) => {
  try {
    let result
    if (where && select)
      result = await prisma[modelName].findMany({ where, select })
    else if (where) result = await prisma[modelName].findMany({ where })
    else if (select) result = await prisma[modelName].findMany({ select })
    else result = await prisma[modelName].findMany()
    return result
  } catch (error) {
    throw error
  }
}

module.exports.readAllWithSort = async (modelName, orderBy, select) => {
  try {
    let result
    if (select) result = await prisma[modelName].findMany({ select, orderBy })
    else result = await prisma[modelName].findMany({ orderBy })
    return result
  } catch (error) {
    throw error
  }
}

module.exports.update = async (modelName, where, data) => {
  try {
    const updatedRecord = await prisma[modelName].update({
      where,
      data,
    })
    return updatedRecord
  } catch (error) {
    throw error
  }
}

module.exports.updateWithoutExecute = (modelName, where, data) => {
  try {
    return prisma[modelName].update({
      where,
      data,
    })
  } catch (error) {
    throw error
  }
}

module.exports.remove = async (modelName, where, select) => {
  try {
    let deletedRecord
    if (select) {
      deletedRecord = await prisma[modelName].delete({
        where,
        select,
      })
    } else {
      deletedRecord = await prisma[modelName].delete({
        where,
      })
    }
    return deletedRecord
  } catch (error) {
    throw error
  }
}

module.exports.removeAll = async (modelName, where, select) => {
  try {
    let deletedRecord
    if (select) {
      deletedRecord = await prisma[modelName].deleteMany({
        where,
        select,
      })
    } else {
      deletedRecord = await prisma[modelName].deleteMany({
        where,
      })
    }
    return deletedRecord
  } catch (error) {
    throw error
  }
}

module.exports.removeAllWithoutExecution = (modelName, whereCluse) => {
  try {
    return prisma[modelName].deleteMany({ where: whereCluse ? whereCluse : {} })
  } catch (error) {
    throw error
  }
}

module.exports.count = async (modelName, where) => {
  try {
    let count
    if (where)
      count = (
        await prisma[modelName].aggregate({
          _count: {
            id: true,
          },
          where,
        })
      )._count.id
    else
      count = (
        await prisma[modelName].aggregate({
          _count: {
            id: true,
          },
        })
      )._count.id
    return count
  } catch (error) {
    throw error
  }
}

module.exports.getNthRecord = async (modelName, skip) => {
  try {
    const NthRecord = await prisma[modelName].findFirst({
      skip,
      take: 1,
    })
    return NthRecord
  } catch (error) {
    throw error
  }
}

module.exports.createPrismaQueryPool = () => {
  return prismaQueriesPool.push([]) - 1
}

module.exports.addPrismaQueryToPool = (index, query) => {
  if (Array.isArray(query)) prismaQueriesPool[index].push(...query)
  else prismaQueriesPool[index].push(query)
}

module.exports.prismaTransaction = async (prismaQueriesPoolIndex) => {
  try {
    const response = await prisma.$transaction(
      prismaQueriesPool[prismaQueriesPoolIndex]
    )
    return response
  } catch (error) {
    throw error
  }
}

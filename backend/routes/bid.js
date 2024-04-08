import authMiddleware from '../middlewares/auth.js'
import { Bid } from '../orm/index.js'
import express from 'express'
import User from './user.js'
import Product from './product.js'

const router = express.Router()

router.delete('/api/bids/:bidId', authMiddleware, async (req, res) => {
  try {
    const deleteBid = await Bid.findByPk(req.params.bidId)
    if (!deleteBid) {
      return res.status(404).send('Error : This product does not exist')
    }
    if (deleteBid.bidderId !== req.user.id && !req.user.admin) {
      return res.status(403).send('Error : Forbidden')
    }
    await deleteBid.destroy()
    res.status(204).send('Error : No Content')
  } catch (error) {
    return res.status(403).send('Error : Forbidden ' + error)
  }
})

router.post('/api/products/:productId/bids', authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params

    req.body.productId = productId
    req.body.bidderId = req.user.id
    req.body.date = new Date()

    res.status(201).json(await Bid.create(req.body))
  } catch (error) {
    res.status(400).json({ error: 'Invalid or missing fields', details: error })
  }
})

export default router

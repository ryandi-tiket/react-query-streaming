// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { name, commerce } from 'faker'

type Item = {
  name: string
}

type Res = {
  data: Item[]
  searchCompleted: boolean
  requestItems: string[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Res>
) {
  const requestItems = req.body
  console.log(requestItems)

  // wait between 0~5 seconds
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve('')
    }, Math.random() * 5000)
  })

  // 10% chance
  const searchCompleted = Math.floor(Math.random() * 11) === 10 ? true : false

  res.status(200).json({
    data: [
      {
        name: commerce.productName(),
      },
      {
        name: commerce.productName(),
      },
    ],
    searchCompleted,
    requestItems: [name.firstName(), name.firstName(), name.firstName()],
  })
}

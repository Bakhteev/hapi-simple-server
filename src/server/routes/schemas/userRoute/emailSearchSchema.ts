import Joi from 'joi'

export const emailSearchSchema = () =>
  Joi.object({
    email: Joi.string()
      .optional()
      .description(
        `<p>Search by email</p>
              <p>Valid value</p>
            <ul>
              <li>example</li>
              <li>example@</li>
              <li>exa</li>
              <li>example@mail.ru</li>
            </ul>
            `
      ),
  }).label('Email search schema ')

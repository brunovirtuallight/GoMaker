import * as Yup from 'yup';
import User from '../models/User';
import Appointment from '../models/Appointments';

class AppointmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação errada' });
    }

    const { provider_id, date } = req.body;

    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'você apenas pode marcar horário com prestadores' });
    }

    const appointment = await Appointment.create({
      user_id: req.user_id,
      provider_id,
      date,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
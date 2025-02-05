const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../index');

const User = require("../models/userModel");
const Availability = require('../models/AvailabilityModel');
const Appointment = require('../models/AppointmentModel');

//Variables
let professor1Token;
let professor1Id;
let professor1Name;

let student1Token;
let student2Token;

let appointment1Id;
let appointment2Id;

// let availabilityId;

//Before every test
beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/Lectures");

    await User.deleteMany({});
    await Availability.deleteMany({});
    await Appointment.deleteMany({});
});

//after every test
afterAll(async () => {
    await mongoose.connection.close();
});

// user registeration
describe('User Registration', () => {

    it('should register a new professor1 successfully', async () => {
        const response = await request(app)
            .post('/api/users/register')
            .send({
                name: 'professor1',
                role: 'professor',
                password: 'professor1',
            });

        professor1Name = response.body?.user?.name;
        professor1Id = response.body?.user?._id;
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('user registered');
    });

    it('should register a new student1 successfully', async () => {
        const response = await request(app)
            .post('/api/users/register')
            .send({
                name: 'student1',
                role: 'student',
                password: 'student1',
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('user registered');
    });

    it('should register a new student2 successfully', async () => {
        const response = await request(app)
            .post('/api/users/register')
            .send({
                name: 'student2',
                role: 'student',
                password: 'student2',
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('user registered');
    });
});

// User Logining In
describe ('users logining In', () => {

    it('should login professor1', async () => {
        const response = await request(app)
        .post('/api/users/login')
        .send({
            name: 'professor1',
            password: 'professor1'}
        );
        professor1Token = response.body?.token;
        expect(response.status).toBe(200);
    });

    it('should login student1', async () => {
        const response = await request(app)
        .post('/api/users/login')
        .send({
            name: 'student1',
            password: 'student1'}
        );
        student1Token = response.body?.token;
        expect(response.status).toBe(200);
    });

    it('should login student2', async () => {
        const response = await request(app)
        .post('/api/users/login')
        .send({
            name: 'student2',
            password: 'student2'}
        );
        student2Token = response.body?.token;
        expect(response.status).toBe(200);
    });
});

// Setting and seeing availability
describe('Setting and seeing availability', () => {

    it('professor1 sets availability S1', async () => {
        const response = await request(app)
        .post('/api/availability/')
        .set('Authorization', `Bearer ${professor1Token}`)
        .send({
            slotId: "S1",
            startTime: "2025-02-10 10:00AM",
            endTime: "2025-02-10 11:00AM",
        });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Availability Set');
    })

    it('professor1 sets availability S2', async () => {
        const response = await request(app)
        .post('/api/availability/')
        .set('Authorization', `Bearer ${professor1Token}`)
        .send({
            slotId: "S2",
            startTime: "2025-02-01 01:00PM",
            endTime: "2025-02-01 02:00PM",
        });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Availability Set');
    })
    
    it('students sees availability', async () => {
        const response = await request(app)
        .get(`/api/availability/${professor1Name}`);
        
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Available time slots');
    })
});

//Appointments routes test
describe('Appointments routes testing', ()=> {

    it('student1 book appointment with professor1 for slot S1', async () => {
        const response = await request(app)
        .post('/api/appointments/')
        .set('Authorization', `Bearer ${student1Token}`)
        .send({
            slotId: "S1",
            professorId: `${professor1Id}`
        });
        
        appointment1Id = response.body?.appointment?._id;
        
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Appointment booked');
    });

    it('student2 book appointment with professor1 for slot S2', async () => {
        const response = await request(app)
        .post('/api/appointments/')
        .set('Authorization', `Bearer ${student2Token}`)
        .send({
            slotId: "S2",
            professorId: `${professor1Id}`
        });
        
        appointment2Id = response.body?.appointment?._id;
        
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Appointment booked');
    });

    it('professor cancels appointment with student1', async () => {
        const response = await request(app)
        .delete(`/api/appointments/${appointment1Id}`)
        .set('Authorization', `Bearer ${professor1Token}`)

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Appointment canceled and slot is again available');
    })

    it('student1 see no pending appointment', async () => {
        const response  = await request(app)
        .get('/api/appointments/student')
        .set('Authorization', `Bearer ${student1Token}`)

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('No pending appointments');
    })
})



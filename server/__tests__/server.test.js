const request = require('supertest');
const app = require('../index');
const pool = require('../pool');


// // afterAll(()=>
// //     {
// //         app.close();
// //     }
// // )
describe('GET /cows', () => {
  it('responds with JSON containing cows', async () => {
    const response = await request(app).get('/cows');
    expect(response.status).toBe(200);
    
  });

 
});

describe('GET /farmers', () => {
  it('responds with JSON containing farmers', async () => {
    const response = await request(app).get('/farmers');
    expect(response.status).toBe(200);
    
  });

 
});





describe('GET /readFarmer/:id', () => {
    it('responds with JSON containing the specified cow', async () => {
      const id = '1'; 
      const response = await request(app).get(`/readFarmer/${id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: '1', name: 'Marinel', age: 10});
    });
  
    it('responds with 404 if farmer with specified id does not exist', async () => {
      const id = 999; 
      const response = await request(app).get(`/readFarmer/${id}`);
      expect(response.status).toBe(404);
      expect(response.text).toBe('farmer not found');
    });
  });
  
  
  describe('PATCH /updateFarmer/:id', () => {
    it('updates the specified farmer', async () => {
      const id = 1; 
      const updatedCow = { name: 'UpdatedCow', age: 6, race: 'UpdatedRace' };
      const response = await request(app)
        .patch(`/updateFarmer/${id}`)
        .send(updatedCow);
      expect(response.status).toBe(200);
      expect(response.text).toBe('farmer updated successfully');
    });
  
    it('responds with 404 if cow with specified id does not exist', async () => {
      const id = 999;
      const updatedCow = { name: 'UpdatedCow', age: 6, race: 'UpdatedRace' };
      const response = await request(app)
        .patch(`/update/${id}`)
        .send(updatedCow);
      expect(response.status).toBe(404);
      expect(response.text).toBe('cow not found');
    });
  });
  
  describe('DELETE /deleteFarmer/:id', () => {
    // it('deletes the specified farmer', async () => {
    //   const id = 1; 
    //   const response = await request(app).delete(`/deleteFarmer/${id}`);
    //   expect(response.status).toBe(204);
    //  // expect(response.text).toBe('cow deleted successfully');
    // });
  
    it('responds with 404 if cow with specified id does not exist', async () => {
      const id = 999;
      const response = await request(app).delete(`/delete/${id}`);
      expect(response.status).toBe(404);
      expect(response.text).toBe('cow not found');
    });
  });




const request = require('supertest');
const app = require('../index');


// afterAll(()=>
//     {
//         app.close();
//     }
// )
describe('GET /', () => {
  it('responds with JSON containing cows', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { id: 1, name: 'Marinela', age: 5, race: 'Angus' },
      { id: 2, name: 'Carmen', age: 3, race: 'Jersey' },
      { id: 3, name: 'Betsy', age: 4, race: 'Limousin' },
      { id: 4, name: 'Mama', age: 6, race: 'Holstein' },
      { id: 5, name: 'Vioric', age: 2, race: 'Hereford' },
    ]);
  });
});


describe('POST /cow', () => {
  it('adds a new cow', async () => {
    const newCow = { name: 'NewCow', age: 1, race: 'Unknown' };
    const response = await request(app)
      .post('/cow')
      .send(newCow);
    expect(response.status).toBe(201);
    expect(response.text).toBe('cow added successfully');
  });
});

describe('GET /read/:id', () => {
    it('responds with JSON containing the specified cow', async () => {
      const id = 1; 
      const response = await request(app).get(`/read/${id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: 1, name: 'Marinela', age: 5, race: 'Angus' });
    });
  
    it('responds with 404 if cow with specified id does not exist', async () => {
      const id = 999; 
      const response = await request(app).get(`/read/${id}`);
      expect(response.status).toBe(404);
      expect(response.text).toBe('cow not found');
    });
  });
  
  describe('PATCH /update/:id', () => {
    it('updates the specified cow', async () => {
      const id = 1; 
      const updatedCow = { name: 'UpdatedCow', age: 6, race: 'UpdatedRace' };
      const response = await request(app)
        .patch(`/update/${id}`)
        .send(updatedCow);
      expect(response.status).toBe(200);
      expect(response.text).toBe('cow updated successfully');
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
  
  describe('DELETE /delete/:id', () => {
    it('deletes the specified cow', async () => {
      const id = 1; 
      const response = await request(app).delete(`/delete/${id}`);
      expect(response.status).toBe(204);
     // expect(response.text).toBe('cow deleted successfully');
    });
  
    it('responds with 404 if cow with specified id does not exist', async () => {
      const id = 999;
      const response = await request(app).delete(`/delete/${id}`);
      expect(response.status).toBe(404);
      expect(response.text).toBe('cow not found');
    });
  });



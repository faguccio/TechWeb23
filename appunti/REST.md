# Appunti su REST API

REST stays for _Representational State Transfer_ and it's an API that conforms to some design principles.

## Methods

The HTTP methods used by REST implements the CRUD operations (the typical pattern to use DATA). Reference for [REST HTTP METHODS](https://restfulapi.net/http-methods/)

### GET

Retrieve resource informations only. It's safe because it won't change the state of the resource. It's indempotent until another PUT or POST is called

### POST and PUT

I have some confusion on which should be the create and which the update

### DELETE

Delete the resource. Not cachable.

## Skeleton of REST APIs

- endpoint
  - the URL of the resource
- method
  - GET, POST, PUT, DELETE
- headers
  - provide authentication
  - information about the body
- body
  - data of the request

## Costrains

The costrains we apply to the system to define a **RESTful** API

### Client-Server

The client-server design pattern enforce the separation of concerns.

- focus on portability for clients
- focus on scalability for servers (storing data)

### Stateless

Every requests must contain all the necessary information to understand and complete the request. No information about previous request is needed.

- The client must keep track of the session state
- Improvments

  - scalability: server doesn't need to keep track of states (easier implementation and faster processing)
  - reliability: recover from failed requests
  - visibility: monitoring the system is easier

- Trade off:
  - efficiency: resend information about previous requests
  - server has less control on consistent behavior from client

### Caching

Some responses are labeled **cachable**. If so, the client will reuse the last responses instead of making a new request.

### Uniform Interface

You have a series of design pattern that qualify the API as having a uniform interface which is good.

### Layered System

The architecure of the system can and should be devided accross multiple layers. For instance, a server may authenticate requests while another may store the data.

### Code on Demand

### Idempotence

Making multiple equal request have the same effect. Not all requests need to be idempotent for the API to be restful (creation of new resources may be not idempotent)

- Adding $1$ to a resource field is not an _idempotent_ operation

## Resource

The abstraciton of a resource is a key conept of REST. Any information is a resource.

- A resource can be a singleton or a collection
  - `customer`
  - `customer/{id}`
  - URI convention
- [a list of useful advice on resource naming](https://restfulapi.net/resource-naming/)

<?php

/**
 * @OA\Info(
 *     title="API - Cólera Angola",
 *     version="1.0.0",
 *     description="Documentação da API REST do projeto Cólera Angola",
 *     @OA\Contact(
 *         name="Justino Contingo",
 *         email="jkotingo25@gmail.com"
 *     ),
 *     @OA\License(
 *         name="MIT",
 *         url="https://opensource.org/licenses/MIT"
 *     )
 * )
 *
 * @OA\Server(
 *     url=L5_SWAGGER_CONST_HOST,
 *     description="Servidor principal"
 * )
 *
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     description="Autenticação usando token JWT (Bearer Token)."
 * )
 */

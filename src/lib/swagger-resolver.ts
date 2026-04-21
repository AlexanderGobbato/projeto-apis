import { JsonValue } from "@prisma/client/runtime/library";

export interface SwaggerJSON {
  info: { 
    title: string;
    description?: string;
  };
  servers?: { url: string }[];
  components?: {
    securitySchemes?: Record<string, { description?: string }>;
    schemas?: Record<string, any>;
  };
  paths: Record<string, Record<string, any>>;
}

export interface ResolvedResource {
  path: string;
  metodo: string;
  tag: string;
  descricao: string;
  request: string;
  response: string;
  modelo_json: JsonValue;
}

export interface ResolvedProject {
  nome: string;
  url_base: string;
  scopes: { nome: string; descricao: string }[];
  recursos: ResolvedResource[];
}

/**
 * Resolve o schema do Swagger de forma recursiva para gerar um JSON de exemplo.
 */
function resolveSchema(schema: any, components: any, depth = 0): any {
  if (depth > 10) return "..."; // Evitar loop infinito em schemas recursivos

  if (!schema) return null;

  // Se for uma referência, buscar no components
  if (schema.$ref) {
    const refPath = schema.$ref.replace('#/components/schemas/', '');
    const refSchema = components?.schemas?.[refPath];
    if (!refSchema) return `Ref not found: ${refPath}`;
    return resolveSchema(refSchema, components, depth + 1);
  }

  // Se tiver um exemplo ou valor padrão, retornar ele
  if (schema.example !== undefined) return schema.example;
  if (schema.default !== undefined) return schema.default;

  // Lógica por tipo
  switch (schema.type) {
    case 'string':
      if (schema.format === 'date-time') return new Date().toISOString();
      if (schema.format === 'date') return new Date().toISOString().split('T')[0];
      return "";
    case 'number':
    case 'integer':
      return 0;
    case 'boolean':
      return false;
    case 'array':
      const itemExample = resolveSchema(schema.items, components, depth + 1);
      return [itemExample];
    case 'object':
      const obj: Record<string, any> = {};
      if (schema.properties) {
        for (const [key, prop] of Object.entries(schema.properties)) {
          obj[key] = resolveSchema(prop, components, depth + 1);
        }
      }
      return obj;
    default:
      // Caso não tenha tipo definido mas tenha propriedades
      if (schema.properties) {
        const obj: Record<string, any> = {};
        for (const [key, prop] of Object.entries(schema.properties)) {
          obj[key] = resolveSchema(prop, components, depth + 1);
        }
        return obj;
      }
      return null;
  }
}

export function parseSwagger(swagger: SwaggerJSON): ResolvedProject {
  const nome = swagger.info?.title || "Projeto Sem Título";
  const url_base = swagger.servers?.[0]?.url || "";
  
  const scopes: { nome: string; descricao: string }[] = [];
  if (swagger.components?.securitySchemes) {
    for (const [key, scheme] of Object.entries(swagger.components.securitySchemes)) {
      scopes.push({
        nome: key,
        descricao: scheme.description || ""
      });
    }
  }

  const recursos: ResolvedResource[] = [];

  for (const [path, methods] of Object.entries(swagger.paths)) {
    for (const [metodo, details] of Object.entries(methods)) {
      if (['get', 'post', 'put', 'delete', 'patch'].includes(metodo.toLowerCase())) {
        const tag = details.tags?.[0] || "Geral";
        const descricao = details.description || details.summary || "";
        
        // Tenta extrair o request e response originais (strings)
        // No Swagger, requestBody costuma ter um content/application/json/schema
        const requestSchema = details.requestBody?.content?.['application/json']?.schema;
        const responseSchema = details.responses?.['200']?.content?.['application/json']?.schema 
                            || details.responses?.['201']?.content?.['application/json']?.schema;

        const requestBody = requestSchema ? resolveSchema(requestSchema, swagger.components) : null;
        const responseBody = responseSchema ? resolveSchema(responseSchema, swagger.components) : null;

        recursos.push({
          path,
          metodo: metodo.toUpperCase(),
          tag,
          descricao,
          request: requestBody ? JSON.stringify(requestBody, null, 2) : "",
          response: responseBody ? JSON.stringify(responseBody, null, 2) : "",
          modelo_json: responseBody as JsonValue
        });
      }
    }
  }

  return {
    nome,
    url_base,
    scopes,
    recursos
  };
}
